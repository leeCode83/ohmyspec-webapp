"use client";
/**
 * live.tsx — interactive flatbed plotter figure.
 *
 * Animation system:
 *  - Idle tour: runs named "programs" in rotation (lines, zigzag, box, letterL,
 *    letterS, triangle, grid). Each program is a sequence of {x,y,pen} waypoints.
 *    The tour interpolates between waypoints with the same spring physics used
 *    for user interaction, so motion is always smooth and physically consistent.
 *  - Strokes: drawn real-time as the pen moves while held down (live polyline
 *    growing each frame), committed as SVG paths when pen lifts.
 *  - User interaction: hover follows X, drag (hold) lowers pen and follows XY,
 *    keyboard for nudge / pen toggle.
 */
import * as React from "react";
import { IsoFigure } from "@/components/iso/react/draw";
import { useReadout, useLoop, asksForStillness, spring } from "@/components/iso/react/live";
import {
  makeState, settled, readoutOf,
  TRAVEL_MIN_X, TRAVEL_MAX_X, TRAVEL_MIN_Y, TRAVEL_MAX_Y,
  PEN_UP_Z, PEN_DOWN_Z,
  type PlotterState,
} from "./model";
import { WIDTH, HEIGHT, EX, at as worldAt } from "./view";
import { frameOf, type Frame } from "./frame";

// ─── Spring tuning ────────────────────────────────────────────────────────────
const CAR_STIFF  = 280;
const CAR_DAMP   = 20;
const PEN_STIFF  = 460;
const PEN_DAMP   = 26;
const NUDGE      = 15;
const TOUR_START = 1200;   // ms idle before tour begins
const TOUR_BACK  = 3000;   // ms after last engagement before tour resumes

// ─── Tour programs ────────────────────────────────────────────────────────────
// Each waypoint: [x, y, penDown]. The tour springs toward each waypoint in
// sequence; it advances to the next once the carriage is within ADVANCE_THRESH
// world units AND the pen state matches.
const ADVANCE_THRESH = 3;

type Waypoint = { x: number; y: number; pen: boolean };

/** Thin horizontal lines filling the paper — classic plotter fill */
const PROG_LINES: Waypoint[] = [
  { x: -80, y: -65, pen: false },
  { x: -80, y: -65, pen: true  },
  { x:  75, y: -65, pen: true  },
  { x:  75, y: -65, pen: false },
  { x: -80, y: -40, pen: false },
  { x: -80, y: -40, pen: true  },
  { x:  75, y: -40, pen: true  },
  { x:  75, y: -40, pen: false },
  { x: -80, y: -15, pen: false },
  { x: -80, y: -15, pen: true  },
  { x:  75, y: -15, pen: true  },
  { x:  75, y: -15, pen: false },
  { x: -80, y:  10, pen: false },
  { x: -80, y:  10, pen: true  },
  { x:  75, y:  10, pen: true  },
  { x:  75, y:  10, pen: false },
  { x: -80, y:  35, pen: false },
  { x: -80, y:  35, pen: true  },
  { x:  75, y:  35, pen: true  },
  { x:  75, y:  35, pen: false },
  { x:   0, y:   0, pen: false }, // return home
];

/** Zigzag / sawtooth across the paper */
const PROG_ZIGZAG: Waypoint[] = [
  { x: -75, y: -60, pen: false },
  { x: -75, y: -60, pen: true  },
  { x:   0, y:  55, pen: true  },
  { x:  75, y: -60, pen: true  },
  { x:   0, y:  55, pen: true  },
  { x: -75, y: -60, pen: true  },
  { x: -75, y: -60, pen: false },
  { x:   0, y:   0, pen: false },
];

/** Rectangle outline */
const PROG_BOX: Waypoint[] = [
  { x: -65, y: -55, pen: false },
  { x: -65, y: -55, pen: true  },
  { x:  65, y: -55, pen: true  },
  { x:  65, y:  55, pen: true  },
  { x: -65, y:  55, pen: true  },
  { x: -65, y: -55, pen: true  }, // close
  { x: -65, y: -55, pen: false },
  { x:   0, y:   0, pen: false },
];

/** Cross (+) */
const PROG_CROSS: Waypoint[] = [
  { x:   0, y: -65, pen: false },
  { x:   0, y: -65, pen: true  },
  { x:   0, y:  65, pen: true  },
  { x:   0, y:  65, pen: false },
  { x: -75, y:   0, pen: false },
  { x: -75, y:   0, pen: true  },
  { x:  75, y:   0, pen: true  },
  { x:  75, y:   0, pen: false },
  { x:   0, y:   0, pen: false },
];

/** Diamond / rotated square */
const PROG_DIAMOND: Waypoint[] = [
  { x:   0, y: -65, pen: false },
  { x:   0, y: -65, pen: true  },
  { x:  70, y:   0, pen: true  },
  { x:   0, y:  65, pen: true  },
  { x: -70, y:   0, pen: true  },
  { x:   0, y: -65, pen: true  }, // close
  { x:   0, y: -65, pen: false },
  { x:   0, y:   0, pen: false },
];

/** Grid: horizontal + vertical lines */
const PROG_GRID: Waypoint[] = [
  // horizontals
  { x: -70, y: -50, pen: false },
  { x: -70, y: -50, pen: true  }, { x: 70, y: -50, pen: true  }, { x: 70, y: -50, pen: false },
  { x: -70, y:   0, pen: false },
  { x: -70, y:   0, pen: true  }, { x: 70, y:   0, pen: true  }, { x: 70, y:   0, pen: false },
  { x: -70, y:  50, pen: false },
  { x: -70, y:  50, pen: true  }, { x: 70, y:  50, pen: true  }, { x: 70, y:  50, pen: false },
  // verticals
  { x: -50, y: -65, pen: false },
  { x: -50, y: -65, pen: true  }, { x: -50, y: 65, pen: true  }, { x: -50, y: 65, pen: false },
  { x:   0, y: -65, pen: false },
  { x:   0, y: -65, pen: true  }, { x:   0, y: 65, pen: true  }, { x:   0, y: 65, pen: false },
  { x:  50, y: -65, pen: false },
  { x:  50, y: -65, pen: true  }, { x:  50, y: 65, pen: true  }, { x:  50, y: 65, pen: false },
  { x:   0, y:   0, pen: false },
];

/** Spiral approximation using concentric boxes */
const PROG_SPIRAL: Waypoint[] = [
  { x: -75, y: -65, pen: false },
  { x: -75, y: -65, pen: true  },
  { x:  75, y: -65, pen: true  },
  { x:  75, y:  65, pen: true  },
  { x: -75, y:  65, pen: true  },
  { x: -75, y: -40, pen: true  },
  { x:  50, y: -40, pen: true  },
  { x:  50, y:  40, pen: true  },
  { x: -50, y:  40, pen: true  },
  { x: -50, y: -15, pen: true  },
  { x:  25, y: -15, pen: true  },
  { x:  25, y:  15, pen: true  },
  { x: -25, y:  15, pen: true  },
  { x: -25, y:  -15, pen: true },
  { x:  25, y:  -15, pen: false },
  { x:   0, y:   0,  pen: false },
];

/** W-shape */
const PROG_W: Waypoint[] = [
  { x: -75, y: -60, pen: false },
  { x: -75, y: -60, pen: true  },
  { x: -40, y:  55, pen: true  },
  { x:   0, y: -15, pen: true  },
  { x:  40, y:  55, pen: true  },
  { x:  75, y: -60, pen: true  },
  { x:  75, y: -60, pen: false },
  { x:   0, y:   0, pen: false },
];

const PROGRAMS: Waypoint[][] = [
  PROG_LINES,
  PROG_BOX,
  PROG_ZIGZAG,
  PROG_CROSS,
  PROG_DIAMOND,
  PROG_GRID,
  PROG_SPIRAL,
  PROG_W,
];

// ─── Nodes refs ───────────────────────────────────────────────────────────────
interface Nodes {
  carriage:   SVGGElement | null;
  railY:      SVGGElement | null;
  head:       SVGGElement | null;
  penFill:    SVGPathElement | null;
  penShades:  (SVGPathElement | null)[];
  penTop:     SVGPathElement | null;
  penEdge:    SVGPathElement | null;
  tipFill:    SVGPathElement | null;
  tipTop:     SVGPathElement | null;
  tipShade0:  SVGPathElement | null;
  tipEdge:    SVGPathElement | null;
  cableLeft:  SVGPathElement | null;
  cableRight: SVGPathElement | null;
  cableHead:  SVGPathElement | null;
  strokes:    SVGGElement | null;
  liveStroke: SVGPathElement | null;
}

function applyFrame(nodes: Nodes, frame: Frame) {
  nodes.carriage?.setAttribute("transform", frame.carriageTransform);
  nodes.railY?.setAttribute("transform", frame.carriageTransform);
  nodes.head?.setAttribute("transform", frame.carriageTransform);

  nodes.penFill?.setAttribute("d", frame.penRod.fill);
  frame.penRod.shades?.forEach((d, i) => nodes.penShades[i]?.setAttribute("d", d ?? ""));
  nodes.penTop?.setAttribute("d", frame.penRod.top);
  nodes.penEdge?.setAttribute("d", frame.penRod.outline);

  nodes.tipFill?.setAttribute("d", frame.penTip.fill);
  nodes.tipTop?.setAttribute("d", frame.penTip.top);
  if (frame.penTip.shades[0]) nodes.tipShade0?.setAttribute("d", frame.penTip.shades[0]);
  nodes.tipEdge?.setAttribute("d", frame.penTip.outline);

  nodes.cableLeft?.setAttribute("d", frame.cableLeft);
  nodes.cableRight?.setAttribute("d", frame.cableRight);
  nodes.cableHead?.setAttribute("d", frame.cableHead);
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  label: string;
  table: React.ReactNode;
  railXBack: React.ReactNode;
  paper: React.ReactNode;
  railY: React.ReactNode;
  carriageStatic: React.ReactNode;
  headStatic: React.ReactNode;
  railXFront: React.ReactNode;
  powerBtn: React.ReactNode;
  restFrame: Frame;
}

const RESTING_TEXT = readoutOf(0, 0, false);

// ─── SVG point helpers ────────────────────────────────────────────────────────
const PAPER_Z_SURFACE = 10 + 1 + 0.5; // top of paper + stroke height

function screenPt(x: number, y: number): string {
  const [sx, sy] = worldAt([x, y, PAPER_Z_SURFACE]);
  return `${sx.toFixed(1)},${sy.toFixed(1)}`;
}

export function PlotterLive(props: Props) {
  const { anchor, say } = useReadout<HTMLDivElement>();
  const root = React.useRef<HTMLDivElement>(null);

  const nodes = React.useRef<Nodes>({
    carriage:   null,
    railY:      null,
    head:       null,
    penFill:    null,
    penShades:  [null, null, null, null],
    penTop:     null,
    penEdge:    null,
    tipFill:    null,
    tipTop:     null,
    tipShade0:  null,
    tipEdge:    null,
    cableLeft:  null,
    cableRight: null,
    cableHead:  null,
    strokes:    null,
    liveStroke: null,
  });

  const state = React.useRef<PlotterState>(makeState());

  // ── Tour state ──────────────────────────────────────────────────────────────
  const touring       = React.useRef(false);
  const tourProgIdx   = React.useRef(0);   // which PROGRAMS[]
  const tourWptIdx    = React.useRef(0);   // current waypoint index within program
  const targetX       = React.useRef(0);
  const targetY       = React.useRef(0);

  // ── Live stroke tracking ────────────────────────────────────────────────────
  // livePts: screen-space points of the stroke currently being drawn
  const livePts       = React.useRef<string[]>([]);
  const prevPenHeld   = React.useRef(false);

  // ── User interaction state ──────────────────────────────────────────────────
  const userDown      = React.useRef(false);
  const penToggled    = React.useRef(false);

  const [engaged, setEngaged] = React.useState(false);
  const [visible,  setVisible] = React.useState(false);

  // ── Advance tour waypoint ──────────────────────────────────────────────────
  function advanceTour(s: PlotterState) {
    const prog = PROGRAMS[tourProgIdx.current]!;
    const wpt  = prog[tourWptIdx.current]!;

    // Check if we've reached the current waypoint
    const arrivedXY =
      Math.abs(s.carriageX.at - wpt.x) < ADVANCE_THRESH &&
      Math.abs(s.carriageY.at - wpt.y) < ADVANCE_THRESH;
    const arrivedPen = s.penHeld === wpt.pen;

    if (arrivedXY && arrivedPen) {
      tourWptIdx.current += 1;
      if (tourWptIdx.current >= prog.length) {
        // Program finished — advance to next program
        tourWptIdx.current = 0;
        tourProgIdx.current = (tourProgIdx.current + 1) % PROGRAMS.length;
        // Clear paper between programs
        const g = nodes.current.strokes;
        if (g) while (g.firstChild) g.removeChild(g.firstChild);
        livePts.current = [];
        if (nodes.current.liveStroke) nodes.current.liveStroke.setAttribute("d", "");
      }
    }

    // Set targets from current waypoint (after possible advance)
    const current = PROGRAMS[tourProgIdx.current]![tourWptIdx.current]!;
    targetX.current  = current.x;
    targetY.current  = current.y;
    s.penHeld        = current.pen;
  }

  // ── Commit live stroke to finished strokes group ───────────────────────────
  function commitStroke() {
    if (livePts.current.length < 2) {
      livePts.current = [];
      return;
    }
    const g = nodes.current.strokes;
    if (g) {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("class", "pt-stroke");
      path.setAttribute("d", `M${livePts.current[0]} L${livePts.current.slice(1).join(" L")}`);
      g.appendChild(path);
    }
    livePts.current = [];
    if (nodes.current.liveStroke) nodes.current.liveStroke.setAttribute("d", "");
  }

  // ── Append point to live stroke ────────────────────────────────────────────
  function appendLivePt(x: number, y: number) {
    const pt = screenPt(x, y);
    // Skip duplicate points (position hasn't moved enough)
    if (livePts.current.length > 0) {
      const last = livePts.current[livePts.current.length - 1]!;
      if (last === pt) return;
    }
    livePts.current.push(pt);
    // Update the live stroke element in-place
    const ls = nodes.current.liveStroke;
    if (ls && livePts.current.length >= 2) {
      ls.setAttribute("d", `M${livePts.current[0]} L${livePts.current.slice(1).join(" L")}`);
    }
  }

  // ── Main animation loop ────────────────────────────────────────────────────
  const kick = useLoop((dt, calm) => {
    const s = state.current;

    // Advance tour program each frame
    if (touring.current) {
      advanceTour(s);
    }

    // Advance springs
    const targetPenZ = s.penHeld ? PEN_DOWN_Z : PEN_UP_Z;
    spring(s.carriageX, targetX.current, dt, CAR_STIFF, CAR_DAMP, calm);
    spring(s.carriageY, targetY.current, dt, CAR_STIFF, CAR_DAMP, calm);
    spring(s.penZ,      targetPenZ,      dt, PEN_STIFF, PEN_DAMP, calm);

    const penIsDown = s.penZ.at < (PEN_UP_Z + PEN_DOWN_Z) / 2;

    // Stroke accumulation: append point while pen is physically down
    if (penIsDown) {
      appendLivePt(s.carriageX.at, s.carriageY.at);
    }
    // Commit completed stroke when pen lifts
    if (!penIsDown && prevPenHeld.current) {
      commitStroke();
    }
    prevPenHeld.current = penIsDown;

    // Render frame
    const frame = frameOf(s.carriageX.at, s.carriageY.at, s.penZ.at);
    applyFrame(nodes.current, frame);

    // Readout
    say(readoutOf(s.carriageX.at, s.carriageY.at, penIsDown));
    updateAria(s.carriageX.at, s.carriageY.at, s.penZ.at);

    // Keep looping while touring or not settled
    return touring.current || !settled(s, targetX.current, targetY.current);
  }, visible);

  function updateAria(x: number, y: number, penZ: number) {
    const node = root.current;
    if (!node) return;
    const val = String(Math.round(x));
    if (node.getAttribute("aria-valuenow") !== val) node.setAttribute("aria-valuenow", val);
    const penDown = penZ < (PEN_UP_Z + PEN_DOWN_Z) / 2;
    const text = readoutOf(x, y, penDown);
    if (node.getAttribute("aria-valuetext") !== text) node.setAttribute("aria-valuetext", text);
  }

  // ── IntersectionObserver ───────────────────────────────────────────────────
  React.useEffect(() => {
    const node = root.current;
    if (!node) return;
    const ob = new IntersectionObserver(
      (entries) => setVisible(Boolean(entries.at(-1)?.isIntersecting)),
      { rootMargin: "120px 0px" },
    );
    ob.observe(node);
    return () => ob.disconnect();
  }, []);

  // ── Tour start / stop ──────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!visible || engaged) {
      touring.current = false;
      return;
    }
    const t = window.setTimeout(() => {
      if (asksForStillness()) return;
      // Start tour from the beginning of the next program
      tourWptIdx.current  = 0;
      touring.current     = true;
      kick();
    }, TOUR_START);
    return () => window.clearTimeout(t);
  }, [visible, engaged, kick]);

  React.useEffect(() => {
    if (!engaged) return;
    touring.current = false;
    // Commit any in-progress live stroke on engagement
    commitStroke();
    const t = window.setTimeout(() => setEngaged(false), TOUR_BACK);
    return () => window.clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engaged]);

  // ── Pointer ────────────────────────────────────────────────────────────────
  const xAt = React.useCallback((clientX: number): number | null => {
    const svg = root.current?.querySelector("svg");
    const box = svg?.getBoundingClientRect();
    if (!box || !box.width || !EX[0]) return null;
    const sx = ((clientX - box.left) / box.width) * WIDTH;
    const originSx = WIDTH / 2;
    return (sx - originSx) / EX[0];
  }, []);

  const clampX = (v: number) => Math.max(TRAVEL_MIN_X, Math.min(TRAVEL_MAX_X, v));
  const clampY = (v: number) => Math.max(TRAVEL_MIN_Y, Math.min(TRAVEL_MAX_Y, v));
  const wake   = React.useCallback(() => setEngaged(true), []);

  const handlePointerMove = React.useCallback((e: React.PointerEvent) => {
    const x = xAt(e.clientX);
    if (x === null) return;
    wake();
    if (userDown.current && e.currentTarget.hasPointerCapture(e.pointerId)) {
      targetX.current = clampX(x);
      state.current.penHeld = true;
      kick();
    } else if (e.pointerType === "mouse" && !userDown.current) {
      targetX.current = clampX(x);
      kick();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xAt, wake, kick]);

  const handlePointerDown = React.useCallback((e: React.PointerEvent) => {
    const x = xAt(e.clientX);
    if (x === null) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    userDown.current  = true;
    penToggled.current = false;
    wake();
    targetX.current = clampX(x);
    state.current.penHeld = true;
    kick();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xAt, wake, kick]);

  const handlePointerUp = React.useCallback((e: React.PointerEvent) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    if (userDown.current) {
      userDown.current = false;
      state.current.penHeld = penToggled.current;
      kick();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kick]);

  const handlePointerLeave = React.useCallback((e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || userDown.current) return;
    targetX.current = 0;
    kick();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kick]);

  // ── Keyboard ───────────────────────────────────────────────────────────────
  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    const by  = e.shiftKey ? NUDGE * 3 : NUDGE;
    wake();

    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (e.repeat) return;
      penToggled.current = !penToggled.current;
      state.current.penHeld = penToggled.current;
      kick();
      return;
    }
    if (e.key === "Escape") {
      penToggled.current = false;
      state.current.penHeld = false;
      targetX.current = 0;
      targetY.current = 0;
      kick();
      return;
    }

    let nx: number | null = null;
    let ny: number | null = null;
    if (e.key === "ArrowLeft")  nx = targetX.current - by;
    if (e.key === "ArrowRight") nx = targetX.current + by;
    if (e.key === "ArrowUp")    ny = targetY.current - by;
    if (e.key === "ArrowDown")  ny = targetY.current + by;
    if (e.key === "Home")  { nx = TRAVEL_MIN_X; ny = TRAVEL_MIN_Y; }
    if (e.key === "End")   { nx = TRAVEL_MAX_X; ny = TRAVEL_MAX_Y; }

    if (nx !== null) { e.preventDefault(); targetX.current = clampX(nx); }
    if (ny !== null) { e.preventDefault(); targetY.current = clampY(ny); }
    if (nx !== null || ny !== null) kick();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wake, kick]);

  // ── Bind helper ────────────────────────────────────────────────────────────
  const bind = <K extends keyof Nodes>(key: K) => (node: Nodes[K]) => {
    nodes.current[key] = node;
  };

  const r = props.restFrame;

  return (
    <div
      ref={(node) => {
        root.current = node;
        (anchor as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className="pt-stage iso pt-light"
      role="slider"
      tabIndex={0}
      aria-label={props.label}
      aria-valuemin={TRAVEL_MIN_X}
      aria-valuemax={TRAVEL_MAX_X}
      aria-valuenow={0}
      aria-valuetext={RESTING_TEXT}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onFocus={wake}
      onKeyDown={handleKeyDown}
      style={{ cursor: "crosshair", touchAction: "pan-y", userSelect: "none" }}
    >
      <IsoFigure width={WIDTH} height={HEIGHT} label={props.label}>

        {/* 1. Table */}
        {props.table}

        {/* 2. Rail X back beam */}
        {props.railXBack}

        {/* 3. Paper */}
        {props.paper}

        {/* 4. Committed strokes on paper */}
        <g ref={bind("strokes")} aria-hidden="true" />

        {/* 5. Live stroke currently being drawn */}
        <path
          ref={bind("liveStroke")}
          className="pt-stroke"
          d=""
          aria-hidden="true"
        />

        {/* 6. Rail Y — moves with carriage in X+Y */}
        <g ref={bind("railY")} transform={r.carriageTransform}>
          {props.railY}
        </g>

        {/* 7. Carriage body */}
        <g ref={bind("carriage")} transform={r.carriageTransform}>
          {props.carriageStatic}
        </g>

        {/* 8. Head + pen (all move with carriage) */}
        <g ref={bind("head")} transform={r.carriageTransform}>
          {props.headStatic}

          {/* Pen rod */}
          <g className="iso-solid">
            <path ref={bind("penFill")}  className="iso-fill" d={r.penRod.fill} />
            {[0, 1, 2, 3].map((i) => (
              <path
                key={i}
                ref={(n) => { nodes.current.penShades[i] = n; }}
                className="iso-shade"
                data-shade={i}
                d={r.penRod.shades[i] ?? ""}
              />
            ))}
            <path ref={bind("penTop")}  className="iso-top"              d={r.penRod.top} />
            <path ref={bind("penEdge")} className="iso-line iso-edge" data-tone="mid" d={r.penRod.outline} />
          </g>

          {/* Pen tip — lit accent */}
          <g className="iso-solid pt-pen-tip" data-lit="">
            <path ref={bind("tipFill")}  className="iso-fill" d={r.penTip.fill} />
            <path
              ref={(n) => { nodes.current.tipShade0 = n; }}
              className="iso-shade" data-shade="0"
              d={r.penTip.shades[0] ?? ""}
            />
            <path ref={bind("tipTop")}  className="iso-top"             d={r.penTip.top} />
            <path ref={bind("tipEdge")} className="iso-line iso-edge" data-tone="hi" d={r.penTip.outline} />
          </g>
        </g>

        {/* 9. Cables */}
        <path ref={bind("cableLeft")}  className="iso-line" data-tone="lo" d={r.cableLeft} />
        <path ref={bind("cableRight")} className="iso-line" data-tone="lo" d={r.cableRight} />
        <path ref={bind("cableHead")}  className="iso-line" data-tone="lo" d={r.cableHead} />

        {/* 10. Rail X front end-stops */}
        {props.railXFront}

        {/* 11. Power button */}
        {props.powerBtn}

      </IsoFigure>
    </div>
  );
}
