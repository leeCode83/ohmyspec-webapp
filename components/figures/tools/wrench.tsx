/**
 * IsoWrench — open-end wrench: handle, box head with a bore, and an open jaw
 * (lit accent). Rebuilt per azimuth; accepts a Projection.
 */
import * as k from "@/components/iso/iso-kit";
import { Solid, Line } from "@/components/iso/react/draw";

const Z = 0;
const H = 4;

export function IsoWrench({ p }: { p: k.Projection }) {
  const handle = k.slabOf({ x: -32, y: -4, w: 44, d: 8, r: 3 }, Z, H, p, 4, 1);
  const jawBack = k.slabOf({ x: 12, y: -13, w: 8, d: 26, r: 2 }, Z, H, p, 3, 0.8);
  const jawTop = k.slabOf({ x: 18, y: 7, w: 14, d: 6, r: 2 }, Z, H, p, 3, 0.8);
  const jawBot = k.slabOf({ x: 18, y: -13, w: 14, d: 6, r: 2 }, Z, H, p, 3, 0.8);
  const boxHead = k.slabOf({ x: -38, y: -8, w: 12, d: 16, r: 3 }, Z, H, p, 4, 0.8);
  const boxHole = k.ring(-32, 0, 3.5, Z + H, p, 20);
  const groove = k.lineOnTop([-24, 0], [10, 0], Z + H, p);
  const halo = k.haloOf({ x: -38, y: -13, w: 70, d: 26, r: 4 }, -1, 2, p);

  return (
    <g>
      <path className="iso-halo" d={halo} />
      <Solid paths={boxHead} tone="mid" crease="faint" />
      <Line d={boxHole} tone="lo" />
      <Solid paths={handle} tone="mid" crease="faint" />
      <Line d={groove} tone="faint" />
      <g className="iso-solid tool-accent" data-lit="">
        <path className="iso-fill" d={jawBack.fill} />
        {jawBack.shades.map((d, i) => (d ? <path key={i} className="iso-shade" data-shade={i} d={d} /> : null))}
        <path className="iso-top" d={jawBack.top} />
        <path className="iso-line iso-edge" data-tone="hi" d={jawBack.outline} />
      </g>
      <Solid paths={jawTop} tone="mid" crease="faint" />
      <Solid paths={jawBot} tone="mid" crease="faint" />
    </g>
  );
}
