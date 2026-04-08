// @vitest-environment jsdom

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { themes } from "@/lib/themes";

describe("AnimatedBackground", () => {
  const themeId = themes[0]?.id ?? "bg-sebastian-svenson-lpbydenbqqg-unsplash";

  it("uses the lighter ambient drift animation in balanced mode", () => {
    const { container } = render(
      <AnimatedBackground theme={themeId} performanceMode="balanced" />,
    );

    expect(container.querySelector("img")?.className).toContain(
      "animate-ambient-drift",
    );
  });

  it("enables the ken burns animation in immersive mode", () => {
    const { container } = render(
      <AnimatedBackground theme={themeId} performanceMode="immersive" />,
    );

    expect(container.querySelector("img")?.className).toContain(
      "animate-ken-burns",
    );
  });
});
