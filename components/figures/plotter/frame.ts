/**
 * frame.ts — paths for parts that change position each animation frame.
 * Now supports both X and Y carriage movement.
 */
import * as k from "@/components/iso/iso-kit";
import { P, CARRIAGE_Z, HEAD_BASE_Z } from "./view";
import { PEN_UP_Z } from "./model";
import { CABLE_ANCHOR_L, CABLE_ANCHOR_R } from "./geometry";

export interface Frame {
  carriageTransform: string;
  penRod:   k.SolidPaths;
  penTip:   k.SolidPaths;
  cableLeft:  string;
  cableRight: string;
  cableHead:  string;
}

export function frameOf(carriageX: number, carriageY: number, penZ: number): Frame {
  const carriageTransform = k.translateAlong(P, [carriageX, carriageY, 0]);

  const rodHeight = Math.max(2, PEN_UP_Z - penZ + 4);
  const penRod = k.cylinder(carriageX, carriageY, 1.5, penZ, rodHeight, P, 20);
  const penTip = k.cylinder(carriageX, carriageY, 2.5, penZ - 4, 4, P, 24);

  // Cables: left anchor → carriage, with slack sag proportional to distance
  const anchorL = k.iso(CABLE_ANCHOR_L, P);
  const cLeftPt = k.iso([carriageX - 12, carriageY, CARRIAGE_Z + 2], P);
  const sagL    = Math.abs(cLeftPt[0] - anchorL[0]) * 0.06 + 4;
  const midL: k.Flat = [
    (anchorL[0] + cLeftPt[0]) / 2,
    Math.max(anchorL[1], cLeftPt[1]) + sagL,
  ];
  const cableLeft = k.pathOf([anchorL, midL, cLeftPt]);

  const anchorR = k.iso(CABLE_ANCHOR_R, P);
  const cRightPt = k.iso([carriageX + 12, carriageY, CARRIAGE_Z + 2], P);
  const sagR    = Math.abs(cRightPt[0] - anchorR[0]) * 0.06 + 4;
  const midR: k.Flat = [
    (anchorR[0] + cRightPt[0]) / 2,
    Math.max(anchorR[1], cRightPt[1]) + sagR,
  ];
  const cableRight = k.pathOf([anchorR, midR, cRightPt]);

  const carTop  = k.iso([carriageX, carriageY - 4, CARRIAGE_Z + 5], P);
  const headBot = k.iso([carriageX, carriageY, HEAD_BASE_Z], P);
  const cableHead = k.pathOf([carTop, headBot]);

  return { carriageTransform, penRod, penTip, cableLeft, cableRight, cableHead };
}

export const REST_FRAME: Frame = frameOf(0, 0, PEN_UP_Z);
