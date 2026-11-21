import { describe, expect, it } from "vitest";
import { safeNextPath } from "./redirect";

describe("safeNextPath", () => {
  it("accepts an in-app absolute path", () => {
    expect(safeNextPath("/join/CODE123")).toBe("/join/CODE123");
  });

  it("accepts a nested path", () => {
    expect(safeNextPath("/w/some-id?tab=members")).toBe("/w/some-id?tab=members");
  });

  it("rejects an absolute external URL", () => {
    expect(safeNextPath("https://evil.example")).toBeNull();
  });

  it("rejects a protocol-relative URL", () => {
    expect(safeNextPath("//evil.example")).toBeNull();
  });

  it("rejects garbage and empty values", () => {
    expect(safeNextPath("nope")).toBeNull();
    expect(safeNextPath("")).toBeNull();
    expect(safeNextPath(undefined)).toBeNull();
  });

  it("takes only the first value of an array param", () => {
    expect(safeNextPath(["/a", "/b"])).toBe("/a");
  });
});
