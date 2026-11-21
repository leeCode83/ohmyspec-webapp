import { describe, expect, it } from "vitest";
import { toUserMessage } from "./errors";

describe("toUserMessage", () => {
  it("passes whitelisted backend messages through verbatim", () => {
    expect(toUserMessage({ message: "This invite link is invalid or the workspace was deleted" })).toBe(
      "This invite link is invalid or the workspace was deleted",
    );
    expect(toUserMessage({ message: "This workspace is full (10 members max)" })).toBe(
      "This workspace is full (10 members max)",
    );
    expect(toUserMessage({ message: "You are already a member of this workspace" })).toBe(
      "You are already a member of this workspace",
    );
    expect(toUserMessage({ message: "The owner cannot leave or remove themselves" })).toBe(
      "The owner cannot leave or remove themselves",
    );
    expect(toUserMessage({ message: "Not authorized" })).toBe("Not authorized");
  });

  it("passes the create_workspace empty-name message through verbatim", () => {
    expect(toUserMessage({ message: "Workspace name cannot be empty" })).toBe(
      "Workspace name cannot be empty",
    );
  });

  it("hides unexpected errors behind the generic message", () => {
    expect(toUserMessage({ message: "relation \"x\" does not exist" })).toBe("Something went wrong");
    expect(toUserMessage({ message: "" })).toBe("Something went wrong");
    expect(toUserMessage(null)).toBe("Something went wrong");
    expect(toUserMessage(undefined)).toBe("Something went wrong");
  });
});
