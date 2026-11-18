import { type Projection, type Point3, type Flat, iso } from "@/components/iso/iso-kit";

/**
 * Shared projection for the six tool figures. The azimuth is a parameter so
 * the figures can orbit around the vertical (Z) axis — left → back → right →
 * front — by rebuilding geometry each frame at a new azimuth. Elevation stays
 * fixed so it reads as a turntable, not a flip.
 */
export const WIDTH = 200;
export const HEIGHT = 200;
export const ELEVATION = 32;
export const BASE_SCALE = 2.0;

export function projectionAt(azimuth: number): Projection {
  return {
    origin: [WIDTH / 2, HEIGHT / 2 + 8],
    scale: BASE_SCALE,
    azimuth,
    elevation: ELEVATION,
  };
}

/** Default static projection (azimuth 45°), used for server render. */
export const P: Projection = projectionAt(45);

export const atIn = (pt: Point3, p: Projection): Flat => iso(pt, p);
