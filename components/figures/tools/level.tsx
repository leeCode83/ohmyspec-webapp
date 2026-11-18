/**
 * IsoLevel — a spirit level: body bar, end caps, a vial well, a yellow bubble
 * (lit accent). Rebuilt per azimuth; accepts a Projection.
 */
import * as k from "@/components/iso/iso-kit";
import { Solid, Line } from "@/components/iso/react/draw";

const Z = 0;
const H = 10;

export function IsoLevel({ p }: { p: k.Projection }) {
  const body = k.slabOf({ x: -38, y: -7, w: 76, d: 14, r: 2 }, Z, H, p, 4, 1.2);
  const capL = k.slabOf({ x: -40, y: -8, w: 6, d: 16, r: 1.5 }, Z, H + 1.5, p, 3, 0.6);
  const capR = k.slabOf({ x: 34, y: -8, w: 6, d: 16, r: 1.5 }, Z, H + 1.5, p, 3, 0.6);
  const vialWell = k.slabOf({ x: -11, y: -4, w: 22, d: 8, r: 3 }, Z + H - 0.4, 0.4, p, 4);
  const vialFrame = k.planOutline({ x: -11, y: -4, w: 22, d: 8, r: 3 }, Z + H, p, 4);
  const bubble = k.cylinder(0, 0, 2.6, Z + H, 1.2, p, 20);
  const marks = [
    k.lineOnTop([-4, -4], [-4, 4], Z + H, p),
    k.lineOnTop([4, -4], [4, 4], Z + H, p),
  ].join("");
  const groove = k.lineOnTop([-30, -7], [30, -7], Z + H, p);
  const halo = k.haloOf({ x: -40, y: -8, w: 80, d: 16, r: 3 }, -1, 2, p);

  return (
    <g>
      <path className="iso-halo" d={halo} />
      <Solid paths={capL} tone="lo" crease="faint" />
      <Solid paths={body} tone="mid" crease="faint" />
      <Line d={groove} tone="faint" />
      <Solid paths={vialWell} tone="lo" crease="none" flat />
      <Line d={vialFrame} tone="lo" />
      <Line d={marks} tone="mid" />
      <g className="iso-solid tool-accent" data-lit="">
        <path className="iso-fill" d={bubble.fill} />
        {bubble.shades.map((d, i) => (d ? <path key={i} className="iso-shade" data-shade={i} d={d} /> : null))}
        <path className="iso-top" d={bubble.top} />
        <path className="iso-line iso-edge" data-tone="hi" d={bubble.outline} />
      </g>
      <Solid paths={capR} tone="lo" crease="faint" />
    </g>
  );
}
