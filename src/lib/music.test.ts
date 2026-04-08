import { describe, expect, it } from "vitest";
import { audioTracks } from "@/lib/music";

describe("music manifest", () => {
  it("exposes the full local track list", () => {
    expect(audioTracks.length).toBeGreaterThan(50);
  });
});
