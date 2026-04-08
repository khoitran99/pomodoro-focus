import { describe, expect, it } from "vitest";
import { isLowPowerClient, resolvePerformanceMode } from "@/lib/performance";

describe("performance mode resolution", () => {
  it("downgrades auto mode on low-power devices", () => {
    expect(
      resolvePerformanceMode("auto", {
        prefersReducedMotion: false,
        saveData: true,
      }),
    ).toBe("balanced");
  });

  it("keeps auto mode immersive on capable devices", () => {
    expect(
      resolvePerformanceMode("auto", {
        deviceMemory: 8,
        hardwareConcurrency: 8,
        prefersReducedMotion: false,
        saveData: false,
      }),
    ).toBe("immersive");
  });

  it("treats reduced motion as a low-power signal", () => {
    expect(
      isLowPowerClient({
        deviceMemory: 16,
        hardwareConcurrency: 16,
        prefersReducedMotion: true,
        saveData: false,
      }),
    ).toBe(true);
  });
});
