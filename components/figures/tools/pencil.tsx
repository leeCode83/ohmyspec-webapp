/**
 * IsoPencil — a pencil laid flat: box barrel, sharpened cone tip, metal
 * ferrule and an eraser (lit accent). Geometry is rebuilt per azimuth so the
 * figure can orbit; accepts a Projection.
 */
import * as k from "@/components/iso/iso-kit";
import { Solid, Line } from "@/components/iso/react/draw";

const Y = 0;
const R = 5;
const Z = R;
const BARREL_X0 = -34;
const BARREL_X1 = 18;
const FERRULE_X1 = 26;
const ERASER_X1 = 32;
const TIP_X0 = BARREL_X0 - 10;

export function IsoPencil({ p }: { p: k.Projection }) {
  const barrel = k.slabOf({ x: BARREL_X0, y: Y - R, w: BARREL_X1 - BARREL_X0, d: R * 2, r: 1.5 }, Z - R, R * 2, p, 3, 1.2);
  const facetTop = k.lineOnTop([BARREL_X0 + 2, Y - 1.6], [BARREL_X1 - 2, Y - 1.6], Z + R, p);
  const facetBot = k.lineOnTop([BARREL_X0 + 2, Y + 1.6], [BARREL_X1 - 2, Y + 1.6], Z + R, p);

  const tipParts: k.SolidPaths[] = [];
  const STEPS = 5;
  for (let i = 0; i < STEPS; i++) {
    const t = i / STEPS;
    const t2 = (i + 1) / STEPS;
    const x0 = BARREL_X0 - (BARREL_X0 - TIP_X0) * t;
    const x1 = BARREL_X0 - (BARREL_X0 - TIP_X0) * t2;
    const r = R * (1 - t2 * 0.9);
    tipParts.push(k.slabOf({ x: x1, y: Y - r, w: x0 - x1 + 0.4, d: r * 2, r: Math.min(r, 1) }, Z - r, r * 2, p, 3));
  }

  const graphite = k.slabOf({ x: TIP_X0 - 1, y: Y - 0.8, w: 2, d: 1.6, r: 0.6 }, Z - 0.8, 1.6, p, 2);
  const ferrule = k.slabOf({ x: BARREL_X1, y: Y - R, w: FERRULE_X1 - BARREL_X1, d: R * 2, r: 1 }, Z - R, R * 2, p, 3, 0.6);
  const ferruleRings = [
    k.lineOnTop([BARREL_X1 + 2, Y - R + 0.5], [BARREL_X1 + 2, Y + R - 0.5], Z + R, p),
    k.lineOnTop([FERRULE_X1 - 2, Y - R + 0.5], [FERRULE_X1 - 2, Y + R - 0.5], Z + R, p),
  ].join("");
  const eraser = k.slabOf({ x: FERRULE_X1, y: Y - R + 0.6, w: ERASER_X1 - FERRULE_X1, d: (R - 0.6) * 2, r: 1.5 }, Z - R + 0.6, (R - 0.6) * 2, p, 3, 0.8);
  const halo = k.haloOf({ x: TIP_X0, y: Y - R, w: ERASER_X1 - TIP_X0, d: R * 2, r: 2 }, -1, 2, p);

  return (
    <g>
      <path className="iso-halo" d={halo} />
      <Solid paths={graphite} tone="hi" crease="none" />
      {tipParts.map((pp, i) => (
        <Solid key={i} paths={pp} tone="lo" crease="faint" />
      ))}
      <Solid paths={barrel} tone="mid" crease="faint" />
      <Line d={facetTop} tone="faint" />
      <Line d={facetBot} tone="faint" />
      <Solid paths={ferrule} tone="hi" crease="faint" />
      <Line d={ferruleRings} tone="lo" />
      <g className="iso-solid tool-accent" data-lit="">
        <path className="iso-fill" d={eraser.fill} />
        {eraser.shades.map((d, i) => (d ? <path key={i} className="iso-shade" data-shade={i} d={d} /> : null))}
        <path className="iso-top" d={eraser.top} />
        <path className="iso-line iso-edge" data-tone="hi" d={eraser.outline} />
      </g>
    </g>
  );
}
