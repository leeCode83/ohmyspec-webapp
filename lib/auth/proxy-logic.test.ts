import { describe, expect, it } from "vitest";
import { resolveAuthRedirect } from "./proxy-logic";

describe("resolveAuthRedirect", () => {
  it("lets anonymous visitors see the landing at /", () => {
    expect(resolveAuthRedirect("/", false)).toBeNull();
  });

  it("bounces authenticated users away from auth pages", () => {
    expect(resolveAuthRedirect("/auth/login", true)).toBe("/");
    expect(resolveAuthRedirect("/auth/signup", true)).toBe("/");
  });

  it("keeps anonymous users on auth pages", () => {
    expect(resolveAuthRedirect("/auth/login", false)).toBeNull();
  });

  it("bounces anonymous users from gated routes with a next param", () => {
    expect(resolveAuthRedirect("/onboarding", false)).toBe(
      "/auth/login?next=%2Fonboarding",
    );
    expect(resolveAuthRedirect("/w/abc-123", false)).toBe(
      "/auth/login?next=%2Fw%2Fabc-123",
    );
  });

  it("lets the join page through in both states", () => {
    expect(resolveAuthRedirect("/join/CODE123", false)).toBeNull();
    expect(resolveAuthRedirect("/join/CODE123", true)).toBeNull();
  });

  it("never redirects authenticated users elsewhere", () => {
    expect(resolveAuthRedirect("/onboarding", true)).toBeNull();
    expect(resolveAuthRedirect("/w/abc", true)).toBeNull();
  });
});
