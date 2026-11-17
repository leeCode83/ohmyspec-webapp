/**
 * geometry.ts — all static SVG paths for the flatbed plotter figure.
 * Computed once at module load; never rebuilt per frame.
 * Moving parts (carriage, pen, cables) live in frame.ts.
 */
import * as k from "@/components/iso/iso-kit";
import {
  P, TABLE_Z, TABLE_H, RAIL_X_Z, RAIL_X_H, PAPER_Z, PAPER_H,
  CARRIAGE_Y, CARRIAGE_Z, CARRIAGE_H, RAIL_Y_Z, RAIL_Y_H,
  HEAD_BASE_Z, HEAD_H,
} from "./view";
import type { SolidPaths } from "@/components/iso/iso-kit";

// ─── Helper to sort plane points by depth (back-to-front) ───────────────────
function byDepth(planes: k.Plane[]): k.Plane[] {
  return [...planes].sort(([ax, ay], [bx, by]) => {
    const da = k.depthOf([ax, ay, 0], P);
    const db = k.depthOf([bx, by, 0], P);
    return da - db;
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// TABLE
// ═══════════════════════════════════════════════════════════════════════════════
const TABLE_PLAN: k.Plan = { x: -150, y: -110, w: 300, d: 220, r: 6 };

// Halo (shadow under table)
const TABLE_HALO = k.haloOf(TABLE_PLAN, TABLE_Z - TABLE_H, TABLE_H, P);

// Table slab
const TABLE_SLAB: SolidPaths = k.slabOf(TABLE_PLAN, TABLE_Z - TABLE_H, TABLE_H, P, 8, 1);

// Side seam (top edge line)
const TABLE_SEAM = k.sideSeam(TABLE_PLAN, TABLE_Z, P, 8);

// Ruler ticks along X axis (front edge of table, y = TABLE_PLAN.y + TABLE_PLAN.d)
const TABLE_RULER_X = k.topTicks(
  TABLE_PLAN.x + 10, TABLE_PLAN.x + TABLE_PLAN.w - 10,
  10, 5, TABLE_PLAN.y + TABLE_PLAN.d - 1, TABLE_Z, [3, 6], P, "x",
);

// Ruler ticks along Y axis (right edge, x = TABLE_PLAN.x + TABLE_PLAN.w)
const TABLE_RULER_Y = k.topTicks(
  TABLE_PLAN.y + 10, TABLE_PLAN.y + TABLE_PLAN.d - 10,
  10, 5, TABLE_PLAN.x + TABLE_PLAN.w - 1, TABLE_Z, [3, 6], P, "y",
);

// Corner screws
const TABLE_SCREWS: k.Flat[] = byDepth(k.corners(TABLE_PLAN, 10))
  .map(([x, y]) => k.iso([x, y, TABLE_Z], P));

// Label plate (bottom-right region of table top)
const LABEL_PLAN: k.Plan = { x: TABLE_PLAN.x + TABLE_PLAN.w - 54, y: TABLE_PLAN.y + TABLE_PLAN.d - 26, w: 48, d: 20, r: 1 };
const TABLE_LABEL_PLATE: SolidPaths = k.slabOf(LABEL_PLAN, TABLE_Z, 0.5, P, 4);
const TABLE_LABEL_LINE = k.planOutline(LABEL_PLAN, TABLE_Z + 0.5, P, 4);
// FaceText transform for "PLTR-01" engraved on the label plate
const LABEL_TRANSFORM = k.topMatrix(
  [LABEL_PLAN.x + 4, LABEL_PLAN.y + 10],
  TABLE_Z + 0.5,
  P,
  "x",
);

// 4 cylinder feet (flange + shaft each)
type FootPair = [SolidPaths, SolidPaths]; // [flange, shaft]
const TABLE_FEET: FootPair[] = byDepth(k.corners(TABLE_PLAN, 18))
  .map(([cx, cy]): FootPair => [
    k.cylinder(cx, cy, 8, TABLE_Z - TABLE_H - 3, 3, P, 24),    // flange
    k.cylinder(cx, cy, 5.5, TABLE_Z - TABLE_H - 16, 13, P, 24), // shaft
  ]);

// Power button (front-left corner of table surface)
const POWER_X = TABLE_PLAN.x + 20;
const POWER_Y = TABLE_PLAN.y + 15;
const POWER_BODY: SolidPaths = k.cylinder(POWER_X, POWER_Y, 5, TABLE_Z, 4, P, 24);
const POWER_DOT: k.Flat[] = [k.iso([POWER_X, POWER_Y, TABLE_Z + 4], P)];
const POWER_RING = k.ring(POWER_X, POWER_Y, 3, TABLE_Z + 4, P, 24);

export const TABLE_ART = {
  halo: TABLE_HALO,
  slab: TABLE_SLAB,
  seam: TABLE_SEAM,
  rulerX: TABLE_RULER_X,
  rulerY: TABLE_RULER_Y,
  screws: TABLE_SCREWS,
  labelPlate: TABLE_LABEL_PLATE,
  labelLine: TABLE_LABEL_LINE,
  labelTransform: LABEL_TRANSFORM,
  feet: TABLE_FEET,
  powerBody: POWER_BODY,
  powerDot: POWER_DOT,
  powerRing: POWER_RING,
};

// ═══════════════════════════════════════════════════════════════════════════════
// RAIL X  (back beam, runs the full table width at y = -60)
// ═══════════════════════════════════════════════════════════════════════════════
const RAIL_X_Y = -60; // fixed Y position of the rail
const RAIL_X_PLAN: k.Plan = { x: TABLE_PLAN.x - 4, y: RAIL_X_Y - 7, w: TABLE_PLAN.w + 8, d: 14, r: 3 };
const RAIL_X_BEAM: SolidPaths = k.slabOf(RAIL_X_PLAN, RAIL_X_Z, RAIL_X_H, P, 8, 1);

// End stops at each end of rail X
const RAIL_X_STOP_L: SolidPaths = k.slabOf(
  { x: TABLE_PLAN.x - 10, y: RAIL_X_Y - 9, w: 10, d: 18, r: 2 },
  RAIL_X_Z, RAIL_X_H + 4, P, 4,
);
const RAIL_X_STOP_R: SolidPaths = k.slabOf(
  { x: TABLE_PLAN.x + TABLE_PLAN.w, y: RAIL_X_Y - 9, w: 10, d: 18, r: 2 },
  RAIL_X_Z, RAIL_X_H + 4, P, 4,
);

// Bushing cylinders on the beam (decorative, 2 per side)
const RAIL_X_BUSHINGS: SolidPaths[] = [
  k.cylinder(TABLE_PLAN.x + 20, RAIL_X_Y, 4.5, RAIL_X_Z + RAIL_X_H, 3, P, 20),
  k.cylinder(TABLE_PLAN.x + TABLE_PLAN.w - 20, RAIL_X_Y, 4.5, RAIL_X_Z + RAIL_X_H, 3, P, 20),
];

// Bolt dots on end stops
const RAIL_X_BOLTS: k.Flat[] = [
  k.iso([TABLE_PLAN.x - 5, RAIL_X_Y, RAIL_X_Z + RAIL_X_H + 2], P),
  k.iso([TABLE_PLAN.x + TABLE_PLAN.w + 5, RAIL_X_Y, RAIL_X_Z + RAIL_X_H + 2], P),
];

// Ruler marks on front face of rail X beam
const RAIL_X_RULER = k.sideTicks(
  TABLE_PLAN.x + 20, TABLE_PLAN.x + TABLE_PLAN.w - 20,
  10, 5, RAIL_X_Y - 7, RAIL_X_Z + RAIL_X_H, [2, 4], P, "x",
);

// Seam line on top of rail
const RAIL_X_SEAM = k.sideSeam(RAIL_X_PLAN, RAIL_X_Z + RAIL_X_H, P, 8);

export const RAIL_X_ART = {
  beam: RAIL_X_BEAM,
  stopL: RAIL_X_STOP_L,
  stopR: RAIL_X_STOP_R,
  bushings: RAIL_X_BUSHINGS,
  bolts: RAIL_X_BOLTS,
  rulerMinor: RAIL_X_RULER.minor,
  rulerMajor: RAIL_X_RULER.major,
  seam: RAIL_X_SEAM,
};

// ═══════════════════════════════════════════════════════════════════════════════
// PAPER  (thin sheet on the table surface)
// ═══════════════════════════════════════════════════════════════════════════════
const PAPER_PLAN: k.Plan = { x: -120, y: -90, w: 240, d: 180, r: 2 };
const PAPER_SLAB: SolidPaths = k.slabOf(PAPER_PLAN, PAPER_Z, PAPER_H, P, 4);
const PAPER_SEAM = k.sideSeam(PAPER_PLAN, PAPER_Z + PAPER_H, P, 4);

// 4 corner clamps holding the paper
type ClampPair = SolidPaths;
const PAPER_CLAMPS: ClampPair[] = byDepth(k.corners(PAPER_PLAN, 6))
  .map(([cx, cy]) =>
    k.slabOf({ x: cx - 7, y: cy - 5, w: 14, d: 10, r: 1 }, PAPER_Z + PAPER_H, 2, P, 4),
  );

// Grid lines on paper (faint, suggest it's a spec sheet)
const PAPER_GRID_H: string[] = [];
const PAPER_GRID_V: string[] = [];
for (let i = 1; i <= 5; i++) {
  const y = PAPER_PLAN.y + (PAPER_PLAN.d / 6) * i;
  PAPER_GRID_H.push(k.lineOnTop([PAPER_PLAN.x + 4, y], [PAPER_PLAN.x + PAPER_PLAN.w - 4, y], PAPER_Z + PAPER_H, P));
}
for (let i = 1; i <= 7; i++) {
  const x = PAPER_PLAN.x + (PAPER_PLAN.w / 8) * i;
  PAPER_GRID_V.push(k.lineOnTop([x, PAPER_PLAN.y + 4], [x, PAPER_PLAN.y + PAPER_PLAN.d - 4], PAPER_Z + PAPER_H, P));
}

export const PAPER_ART = {
  slab: PAPER_SLAB,
  seam: PAPER_SEAM,
  clamps: PAPER_CLAMPS,
  gridH: PAPER_GRID_H.join(""),
  gridV: PAPER_GRID_V.join(""),
};

// expose paper plan for frame.ts
export const PAPER = PAPER_PLAN;

// ═══════════════════════════════════════════════════════════════════════════════
// RAIL Y  (cross beam, sits on the carriage, moves with it in X)
// Rendered at rest position (carriageX=0); live.tsx will apply transform.
// ═══════════════════════════════════════════════════════════════════════════════
const RAIL_Y_CX = 0; // rest X position (carriageX=0)
const RAIL_Y_PLAN: k.Plan = {
  x: RAIL_Y_CX - 8,
  y: TABLE_PLAN.y - 4,
  w: 16,
  d: TABLE_PLAN.d + 8,
  r: 3,
};
const RAIL_Y_BEAM: SolidPaths = k.slabOf(RAIL_Y_PLAN, RAIL_Y_Z, RAIL_Y_H, P, 8, 1);

const RAIL_Y_STOP_BACK: SolidPaths = k.slabOf(
  { x: RAIL_Y_CX - 10, y: TABLE_PLAN.y - 10, w: 20, d: 10, r: 2 },
  RAIL_Y_Z, RAIL_Y_H + 3, P, 4,
);
const RAIL_Y_STOP_FRONT: SolidPaths = k.slabOf(
  { x: RAIL_Y_CX - 10, y: TABLE_PLAN.y + TABLE_PLAN.d, w: 20, d: 10, r: 2 },
  RAIL_Y_Z, RAIL_Y_H + 3, P, 4,
);

const RAIL_Y_BUSHINGS: SolidPaths[] = [
  k.cylinder(RAIL_Y_CX, TABLE_PLAN.y + 20, 4, RAIL_Y_Z + RAIL_Y_H, 2.5, P, 20),
  k.cylinder(RAIL_Y_CX, TABLE_PLAN.y + TABLE_PLAN.d - 20, 4, RAIL_Y_Z + RAIL_Y_H, 2.5, P, 20),
];

const RAIL_Y_SEAM = k.sideSeam(RAIL_Y_PLAN, RAIL_Y_Z + RAIL_Y_H, P, 8);

export const RAIL_Y_ART = {
  beam: RAIL_Y_BEAM,
  stopBack: RAIL_Y_STOP_BACK,
  stopFront: RAIL_Y_STOP_FRONT,
  bushings: RAIL_Y_BUSHINGS,
  seam: RAIL_Y_SEAM,
};

// ═══════════════════════════════════════════════════════════════════════════════
// CARRIAGE  (body that slides along rail X, rendered at rest x=0)
// live.tsx applies translateAlong transform each frame.
// ═══════════════════════════════════════════════════════════════════════════════
const CAR_CX = 0; // rest X
const CAR_PLAN: k.Plan = { x: CAR_CX - 16, y: CARRIAGE_Y - 14, w: 32, d: 28, r: 3 };
const CARRIAGE_BODY: SolidPaths = k.slabOf(CAR_PLAN, CARRIAGE_Z, CARRIAGE_H, P, 6, 1);

// Side bushings (clamp onto rail X)
const CARRIAGE_BUSHINGS: SolidPaths[] = [
  k.cylinder(CAR_CX - 10, CARRIAGE_Y + 10, 4.5, CARRIAGE_Z - 6, 6, P, 20),
  k.cylinder(CAR_CX + 10, CARRIAGE_Y + 10, 4.5, CARRIAGE_Z - 6, 6, P, 20),
];

// Thumb knob (right side)
const CARRIAGE_KNOB: SolidPaths = k.cylinder(CAR_CX + 18, CARRIAGE_Y, 5, CARRIAGE_Z + 1, 6, P, 24, 1);
const CARRIAGE_KNURL_STR = k.knurl(CAR_CX + 18, CARRIAGE_Y, 5, CARRIAGE_Z + 1, CARRIAGE_Z + 7, 24, P);

// Rivet dots on carriage body
const CARRIAGE_RIVETS: k.Flat[] = byDepth(k.corners(CAR_PLAN, 5))
  .map(([x, y]) => k.iso([x, y, CARRIAGE_Z + CARRIAGE_H], P));

// Seat line (where rail Y sits on carriage)
const CARRIAGE_SEAT = k.sideSeam(CAR_PLAN, CARRIAGE_Z + CARRIAGE_H, P, 6);

export const CARRIAGE_ART = {
  body: CARRIAGE_BODY,
  bushings: CARRIAGE_BUSHINGS,
  knob: CARRIAGE_KNOB,
  knurl: CARRIAGE_KNURL_STR,
  rivets: CARRIAGE_RIVETS,
  seat: CARRIAGE_SEAT,
};

// ═══════════════════════════════════════════════════════════════════════════════
// PEN HEAD  (housing + collar + arm, rendered at rest x=0)
// ═══════════════════════════════════════════════════════════════════════════════
const HEAD_CX = 0; // rest X
const HEAD_CY = CARRIAGE_Y;

const HEAD_HOUSING: SolidPaths = k.cylinder(HEAD_CX, HEAD_CY, 8, HEAD_BASE_Z, HEAD_H, P, 32, 1);
const HEAD_COLLAR: SolidPaths  = k.cylinder(HEAD_CX, HEAD_CY, 10, HEAD_BASE_Z - 2, 3, P, 32);
const HEAD_CLAMP: SolidPaths   = k.cylinder(HEAD_CX, HEAD_CY, 10.5, HEAD_BASE_Z + 4, 2, P, 32);

// Short arm connecting housing to rail Y
const HEAD_ARM: SolidPaths = k.slabOf(
  { x: HEAD_CX - 5, y: HEAD_CY - 20, w: 10, d: 20, r: 2 },
  RAIL_Y_Z + RAIL_Y_H, 4, P, 4,
);

// Pen holder (smaller cylinder inside housing)
const HEAD_HOLDER: SolidPaths = k.cylinder(HEAD_CX, HEAD_CY, 3.5, HEAD_BASE_Z + HEAD_H - 2, 6, P, 24);

// Knurl ring on housing
const HEAD_KNURL = k.knurl(HEAD_CX, HEAD_CY, 8, HEAD_BASE_Z + 2, HEAD_BASE_Z + 8, 32, P);

// Side seam on housing top
const HEAD_SEAM = k.ring(HEAD_CX, HEAD_CY, 8, HEAD_BASE_Z + HEAD_H, P, 32);

export const HEAD_ART = {
  housing: HEAD_HOUSING,
  collar: HEAD_COLLAR,
  clamp: HEAD_CLAMP,
  arm: HEAD_ARM,
  holder: HEAD_HOLDER,
  knurl: HEAD_KNURL,
  seam: HEAD_SEAM,
};

// ═══════════════════════════════════════════════════════════════════════════════
// Cable anchor point on the left wall of the table (for frame.ts)
// ═══════════════════════════════════════════════════════════════════════════════
export const CABLE_ANCHOR_L: k.Point3 = [TABLE_PLAN.x - 2, RAIL_X_Y, RAIL_X_Z + 3];
export const CABLE_ANCHOR_R: k.Point3 = [TABLE_PLAN.x + TABLE_PLAN.w + 2, RAIL_X_Y, RAIL_X_Z + 3];
