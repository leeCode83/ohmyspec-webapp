import { type Projection, type Point3, type Flat, iso, axisVector } from "@/components/iso/iso-kit";

// ─── SVG canvas dimensions ────────────────────────────────────────────────────
export const WIDTH = 520;
export const HEIGHT = 390;

// ─── Camera projection ────────────────────────────────────────────────────────
// origin and scale tuned so the plotter fills the canvas without empty space.
// scale 1.65 and a lower origin.y push the table to fill ~85% of the height.
export const P: Projection = {
  origin: [260, 155],
  scale: 1.65,
  azimuth: 45,
  elevation: 30,
};

// ─── World → screen helper ───────────────────────────────────────────────────
export const at = (pt: Point3): Flat => iso(pt, P);

// ─── Screen vector of the X world axis ───────────────────────────────────────
// Used to map pointer clientX → world X (pointer delta / EX[0] = world delta).
export const EX: Flat = axisVector(P, [1, 0, 0]);

// ─── Fixed Z/Y heights for the major layers ──────────────────────────────────
export const TABLE_Z      = 0;   // top of table surface
export const TABLE_H      = 8;   // table thickness
export const RAIL_X_Z     = 14;  // bottom of rail X beam
export const RAIL_X_H     = 6;
export const PAPER_Z      = 10;  // top of paper sheet
export const PAPER_H      = 1;
export const CARRIAGE_Z   = 20;  // bottom of carriage body
export const CARRIAGE_H   = 5;
export const RAIL_Y_Z     = 25;  // bottom of cross-beam (rail Y)
export const RAIL_Y_H     = 5;
export const HEAD_BASE_Z  = 30;  // base of pen housing cylinder
export const HEAD_H       = 10;

// ─── Y position of the rail-Y and carriage (fixed, only X moves) ─────────────
export const CARRIAGE_Y   = 0;
