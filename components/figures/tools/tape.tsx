/**
 * IsoTape — tape measure: round casing, reel window, side button, a blade
 * with a yellow hook (lit accent). Rebuilt per azimuth; accepts a Projection.
 */
import * as k from "@/components/iso/iso-kit";
import { Solid, Line } from "@/components/iso/react/draw";

const Z = 0;
const H = 16;

export function IsoTape({ p }: { p: k.Projection }) {
  const casing = k.slabOf({ x: -18, y: -18, w: 36, d: 36, r: 10 }, Z, H, p, 10, 2);
  const reel = k.cylinder(0, 0, 10, Z + H, 0.6, p, 28);
  const reelRing = k.ring(0, 0, 6, Z + H + 0.6, p, 28);
  const button = k.slabOf({ x: -4, y: 15, w: 8, d: 5, r: 1.5 }, Z + 4, 5, p, 2);
  const blade = k.slabOf({ x: -4, y: -34, w: 8, d: 18, r: 0.5 }, Z + 1, 1.2, p, 2);
  const bladeMarks = [
    k.lineOnTop([-3, -20], [3, -20], Z + 2.2, p),
    k.lineOnTop([-3, -26], [3, -26], Z + 2.2, p),
    k.lineOnTop([-3, -32], [3, -32], Z + 2.2, p),
  ].join("");
  const hook = k.slabOf({ x: -5, y: -37, w: 10, d: 3, r: 0.5 }, Z + 1, 3, p, 2);
  const halo = k.haloOf({ x: -18, y: -37, w: 36, d: 55, r: 10 }, -1, 2, p);

  return (
    <g>
      <path className="iso-halo" d={halo} />
      <Solid paths={blade} tone="lo" crease="faint" />
      <Line d={bladeMarks} tone="mid" />
      <g className="iso-solid tool-accent" data-lit="">
        <path className="iso-fill" d={hook.fill} />
        {hook.shades.map((d, i) => (d ? <path key={i} className="iso-shade" data-shade={i} d={d} /> : null))}
        <path className="iso-top" d={hook.top} />
        <path className="iso-line iso-edge" data-tone="hi" d={hook.outline} />
      </g>
      <Solid paths={casing} tone="mid" crease="faint" />
      <Solid paths={reel} tone="lo" crease="none" flat />
      <Line d={reelRing} tone="lo" />
      <Solid paths={button} tone="mid" crease="faint" />
    </g>
  );
}
