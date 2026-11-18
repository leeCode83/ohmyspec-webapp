/**
 * IsoHammer — claw hammer: handle, neck, claw prongs, head crossbar and a
 * striking face (lit accent). Rebuilt per azimuth; accepts a Projection.
 */
import * as k from "@/components/iso/iso-kit";
import { Solid, Line } from "@/components/iso/react/draw";

const Z = 0;

export function IsoHammer({ p }: { p: k.Projection }) {
  const handle = k.slabOf({ x: -3.5, y: -8, w: 7, d: 44, r: 3 }, Z, 6, p, 3, 1);
  const handleGrip = [
    k.lineOnTop([-3.5, 20], [3.5, 20], Z + 6, p),
    k.lineOnTop([-3.5, 26], [3.5, 26], Z + 6, p),
    k.lineOnTop([-3.5, 32], [3.5, 32], Z + 6, p),
  ].join("");
  const headBlock = k.slabOf({ x: -22, y: -16, w: 44, d: 14, r: 2 }, Z, 11, p, 4, 1.2);
  const face = k.slabOf({ x: 16, y: -15, w: 8, d: 12, r: 2 }, Z, 11, p, 3, 0.8);
  const clawA = k.slabOf({ x: -28, y: -14, w: 8, d: 4, r: 1 }, Z + 1, 7, p, 2, 0.5);
  const clawB = k.slabOf({ x: -28, y: -6, w: 8, d: 4, r: 1 }, Z + 1, 7, p, 2, 0.5);
  const neck = k.slabOf({ x: -4, y: -4, w: 8, d: 8, r: 2 }, Z, 8, p, 3);
  const halo = k.haloOf({ x: -28, y: -16, w: 52, d: 52, r: 4 }, -1, 2, p);

  return (
    <g>
      <path className="iso-halo" d={halo} />
      <Solid paths={handle} tone="lo" crease="faint" />
      <Line d={handleGrip} tone="faint" />
      <Solid paths={neck} tone="mid" crease="faint" />
      <Solid paths={clawA} tone="mid" crease="faint" />
      <Solid paths={clawB} tone="mid" crease="faint" />
      <Solid paths={headBlock} tone="mid" crease="faint" />
      <g className="iso-solid tool-accent" data-lit="">
        <path className="iso-fill" d={face.fill} />
        {face.shades.map((d, i) => (d ? <path key={i} className="iso-shade" data-shade={i} d={d} /> : null))}
        <path className="iso-top" d={face.top} />
        <path className="iso-line iso-edge" data-tone="hi" d={face.outline} />
      </g>
    </g>
  );
}
