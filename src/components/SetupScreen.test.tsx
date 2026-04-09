// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
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
  it("shows only the essential controls on the main panel", () => {
    render(
      <SetupScreen
        initialConfig={baseConfig}
        effectivePerformanceMode="balanced"
        onConfigChange={vi.fn()}
        onStart={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(/session name/i)).not.toBeNull();
    expect(screen.getByRole("button", { name: /start session/i })).not.toBeNull();
    expect(
      screen.getByRole("button", { name: /open custom settings/i }),
    ).not.toBeNull();
    expect(
      screen.getByRole("button", { name: /open theme picker/i }),
    ).not.toBeNull();
    expect(screen.queryByRole("slider")).toBeNull();
    expect(screen.queryByRole("switch")).toBeNull();
    expect(screen.queryByText(/advanced settings/i)).toBeNull();
    expect(screen.queryByText(/custom timers/i)).toBeNull();
  });

  it("keeps the classic pomodoro default implicit", () => {
    render(
      <SetupScreen
        initialConfig={baseConfig}
        effectivePerformanceMode="balanced"
        onConfigChange={vi.fn()}
        onStart={vi.fn()}
      />,
    );

    expect(screen.getByText(/traditional 25 \/ 5 · infinite/i)).not.toBeNull();
    expect(
      (screen.getByLabelText(/session name/i) as HTMLInputElement).value,
    ).toBe("");
    expect(
      (screen.getByLabelText(/session name/i) as HTMLInputElement).placeholder,
    ).toBe("What are you focusing on?");
    expect(screen.queryByText(/^Custom ·/i)).toBeNull();
  });

  it("lets the user set a visible session name from the hero input", () => {
    const onConfigChange = vi.fn();

    render(
      <SetupScreen
        initialConfig={baseConfig}
        effectivePerformanceMode="balanced"
        onConfigChange={onConfigChange}
        onStart={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText(/session name/i), {
      target: { value: "Design Review" },
    });

    expect(onConfigChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ sessionName: "Design Review" }),
    );
    expect(
      (screen.getByLabelText(/session name/i) as HTMLInputElement).value,
    ).toBe("Design Review");
  });

  it("does not mutate the live config until settings are applied", async () => {
    const onConfigChange = vi.fn();

    render(
      <SetupScreen
        initialConfig={baseConfig}
        effectivePerformanceMode="balanced"
        onConfigChange={onConfigChange}
        onStart={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /open custom settings/i }));

    const dialog = await screen.findByRole("dialog", {
      name: /custom settings/i,
    });

    fireEvent.change(within(dialog).getByRole("slider", { name: /focus/i }), {
      target: { value: "45" },
    });
    fireEvent.click(within(dialog).getByRole("button", { name: /cancel/i }));

    expect(onConfigChange).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog", { name: /custom settings/i })).toBeNull();
    expect(screen.queryByText(/^Custom ·/i)).toBeNull();
  });

  it("applies custom settings and shows a compact custom summary", async () => {
    const onConfigChange = vi.fn();

    render(
      <SetupScreen
        initialConfig={baseConfig}
        effectivePerformanceMode="balanced"
        onConfigChange={onConfigChange}
        onStart={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /open custom settings/i }));

    const dialog = await screen.findByRole("dialog", {
      name: /custom settings/i,
    });

    fireEvent.change(within(dialog).getByRole("slider", { name: /focus/i }), {
      target: { value: "45" },
    });
    fireEvent.change(within(dialog).getByRole("slider", { name: /break/i }), {
      target: { value: "10" },
    });
    fireEvent.click(
      within(dialog).getByRole("switch", { name: /toggle infinite mode/i }),
    );
    fireEvent.click(
      within(dialog).getByRole("button", { name: /apply settings/i }),
    );

    expect(onConfigChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        workDuration: 45,
        restDuration: 10,
        iterations: 4,
      }),
    );
    expect(screen.getByText("Custom · 45m / 10m · 4x")).not.toBeNull();
  });

  it("can reset back to classic pomodoro from the custom modal", async () => {
    const onConfigChange = vi.fn();

    render(
      <SetupScreen
        initialConfig={{ ...baseConfig, workDuration: 40, restDuration: 8, iterations: 3 }}
        effectivePerformanceMode="balanced"
        onConfigChange={onConfigChange}
        onStart={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /open custom settings/i }));

    const dialog = await screen.findByRole("dialog", {
      name: /custom settings/i,
    });

    fireEvent.click(
      within(dialog).getByRole("button", {
        name: /reset to classic pomodoro/i,
      }),
    );
    fireEvent.click(
      within(dialog).getByRole("button", { name: /apply settings/i }),
    );

    expect(onConfigChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        workDuration: 25,
        restDuration: 5,
        iterations: 0,
      }),
    );
    expect(screen.queryByText(/^Custom ·/i)).toBeNull();
  });
});
