import type { Spring } from "@/components/iso/react/live";

// ─── Physical travel range (world units) ─────────────────────────────────────
export const TRAVEL_MIN_X = -85;
export const TRAVEL_MAX_X =  85;
export const TRAVEL_MIN_Y = -75;
export const TRAVEL_MAX_Y =  75;

/** Legacy alias used by live.tsx pointer mapping */
export const TRAVEL_MIN = TRAVEL_MIN_X;
export const TRAVEL_MAX = TRAVEL_MAX_X;

// ─── Pen Z positions (world units, z up) ─────────────────────────────────────
export const PEN_UP_Z   = 28;
export const PEN_DOWN_Z = 18;

// ─── State ───────────────────────────────────────────────────────────────────
export interface PlotterState {
  carriageX: Spring;
  carriageY: Spring;
  penZ:      Spring;
  penHeld:   boolean;
}

export function makeState(): PlotterState {
  return {
    carriageX: { at: 0, rate: 0 },
    carriageY: { at: 0, rate: 0 },
    penZ:      { at: PEN_UP_Z, rate: 0 },
    penHeld:   false,
  };
}

export function settled(
  state: PlotterState,
  targetX: number,
  targetY: number,
): boolean {
  const targetZ = state.penHeld ? PEN_DOWN_Z : PEN_UP_Z;
  return (
    Math.abs(state.carriageX.at - targetX) < 0.08 &&
    Math.abs(state.carriageX.rate)          < 0.08 &&
    Math.abs(state.carriageY.at - targetY) < 0.08 &&
    Math.abs(state.carriageY.rate)          < 0.08 &&
    Math.abs(state.penZ.at - targetZ)       < 0.08 &&
    Math.abs(state.penZ.rate)               < 0.08
  );
}

export function readoutOf(x: number, y: number, penDown: boolean): string {
  const mx = Math.round(x + 90);
  const my = Math.round(y + 80);
  return `X:${mx} Y:${my} · ${penDown ? "drawing" : "pen up"}`;
}
