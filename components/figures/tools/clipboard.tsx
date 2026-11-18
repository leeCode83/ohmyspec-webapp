/**
 * IsoClipboard — board slab, metal clip (lit accent), a sheet with rule
 * lines. Rebuilt per azimuth; accepts a Projection.
 */
import * as k from "@/components/iso/iso-kit";
import { Solid, Line, Dots } from "@/components/iso/react/draw";

const BOARD: k.Plan = { x: -26, y: -34, w: 52, d: 68, r: 3 };
const PAPER: k.Plan = { x: -21, y: -27, w: 42, d: 54, r: 1 };
const CLIP: k.Plan = { x: -9, y: -37, w: 18, d: 8, r: 2 };

export function IsoClipboard({ p }: { p: k.Projection }) {
  const boardSlab = k.slabOf(BOARD, 0, 3, p, 6, 1);
  const paperSlab = k.slabOf(PAPER, 3, 1.2, p, 2);
  const clipBody = k.slabOf(CLIP, 4.2, 4, p, 2, 0.6);
  const clipLip = k.slabOf({ x: -6, y: -33, w: 12, d: 4, r: 1 }, 8, 1.5, p, 2);

  const RULES: string[] = [];
  for (let i = 1; i <= 6; i++) {
    const y = PAPER.y + 10 + i * 6;
    RULES.push(k.lineOnTop([PAPER.x + 5, y], [PAPER.x + PAPER.w - 5, y], 4.2, p));
  }
  const ruleLines = RULES.join("");
  const headLines = [
    k.lineOnTop([PAPER.x + 5, PAPER.y + 7], [PAPER.x + 24, PAPER.y + 7], 4.2, p),
    k.lineOnTop([PAPER.x + 5, PAPER.y + 11], [PAPER.x + 18, PAPER.y + 11], 4.2, p),
  ].join("");

  const screws = k.corners(BOARD, 5).map(([x, y]) => k.iso([x, y, 3], p));
  const halo = k.haloOf(BOARD, -1, 2, p);

  return (
    <g>
      <path className="iso-halo" d={halo} />
      <Solid paths={boardSlab} tone="mid" crease="faint" />
      <Dots points={screws} size={0.7} tone="mid" />
      <Solid paths={paperSlab} tone="lo" crease="none" flat />
      <Line d={headLines} tone="mid" />
      <Line d={ruleLines} tone="faint" />
      <g className="iso-solid tool-accent" data-lit="">
        <path className="iso-fill" d={clipBody.fill} />
        {clipBody.shades.map((d, i) => (d ? <path key={i} className="iso-shade" data-shade={i} d={d} /> : null))}
        <path className="iso-top" d={clipBody.top} />
        <path className="iso-line iso-edge" data-tone="hi" d={clipBody.outline} />
      </g>
      <Solid paths={clipLip} tone="mid" crease="faint" />
    </g>
  );
}
