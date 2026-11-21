import { describe, expect, it } from "vitest";
import { PASSWORD_RULES, passwordIsStrong } from "./password-rules";

describe("passwordIsStrong (server policy mirror)", () => {
  it("accepts a password satisfying all four classes at length 8", () => {
    expect(passwordIsStrong("Str0ng!x")).toBe(true);
  });

  it("rejects each missing character class", () => {
    expect(passwordIsStrong("strong!x1")).toBe(false); // no uppercase
    expect(passwordIsStrong("STRONG!X1")).toBe(false); // no lowercase
    expect(passwordIsStrong("Strong!x")).toBe(false);  // no digit
    expect(passwordIsStrong("Strong1x")).toBe(false);  // no symbol
  });

  it("rejects anything shorter than 8 chars", () => {
    expect(passwordIsStrong("St1!x")).toBe(false);
  });
});

describe("PASSWORD_RULES", () => {
  it("exposes exactly the five server rules", () => {
    expect(PASSWORD_RULES.map((r) => r.id)).toEqual([
      "length",
      "uppercase",
      "lowercase",
      "digit",
      "symbol",
    ]);
  });

  it("labels are user-facing strings", () => {
    expect(PASSWORD_RULES.every((r) => r.label.length > 0)).toBe(true);
  });
});
