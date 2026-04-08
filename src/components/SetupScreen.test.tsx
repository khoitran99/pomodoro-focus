// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { SetupScreen } from "@/components/SetupScreen";
import type { PomodoroConfig } from "@/hooks/usePomodoro";

const baseConfig: PomodoroConfig = {
  sessionName: "Pomodoro",
  workDuration: 25,
  restDuration: 5,
  iterations: 0,
  theme: "bg-sebastian-svenson-lpbydenbqqg-unsplash",
  performanceMode: "balanced",
};

afterEach(() => {
  cleanup();
});

describe("SetupScreen", () => {
  it("hides the performance picker and lets the session be named", () => {
    const onConfigChange = vi.fn();

    render(
      <SetupScreen
        initialConfig={baseConfig}
        effectivePerformanceMode="balanced"
        onConfigChange={onConfigChange}
        onStart={vi.fn()}
      />,
    );

    expect(screen.queryByText(/^Performance$/i)).toBeNull();

    fireEvent.change(screen.getByLabelText(/session name/i), {
      target: { value: "Writing Block" },
    });

    expect(onConfigChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ sessionName: "Writing Block" }),
    );
  });

  it("restores the previous finite iteration count when infinite mode is turned off", () => {
    const onConfigChange = vi.fn();

    render(
      <SetupScreen
        initialConfig={{ ...baseConfig, iterations: 6 }}
        effectivePerformanceMode="balanced"
        onConfigChange={onConfigChange}
        onStart={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /advanced settings/i }));
    fireEvent.click(screen.getByRole("switch", { name: /toggle infinite mode/i }));
    fireEvent.click(screen.getByRole("switch", { name: /toggle infinite mode/i }));

    expect(onConfigChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ iterations: 6 }),
    );
  });

  it("falls back to four iterations when leaving infinite mode without prior finite state", () => {
    const onConfigChange = vi.fn();

    render(
      <SetupScreen
        initialConfig={baseConfig}
        effectivePerformanceMode="balanced"
        onConfigChange={onConfigChange}
        onStart={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /advanced settings/i }));
    fireEvent.click(screen.getByRole("switch", { name: /toggle infinite mode/i }));

    expect(onConfigChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ iterations: 4 }),
    );
  });
});
