// @vitest-environment jsdom

import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useRef } from "react";
import { usePomodoro, type PomodoroConfig } from "@/hooks/usePomodoro";

describe("usePomodoro", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("defaults first-time users to classic pomodoro with infinite iterations", () => {
    const { result } = renderHook(() => usePomodoro());

    expect(result.current.config.workDuration).toBe(25);
    expect(result.current.config.restDuration).toBe(5);
    expect(result.current.config.iterations).toBe(0);
  });

  it("transitions from work to rest to complete for a finite session", () => {
    const { result } = renderHook(() => usePomodoro());

    const quickConfig: PomodoroConfig = {
      ...result.current.config,
      workDuration: 1 / 60,
      restDuration: 1 / 60,
      iterations: 1,
    };

    act(() => {
      result.current.startSession(quickConfig);
    });

    expect(result.current.phase).toBe("work");
    expect(result.current.isRunning).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.phase).toBe("rest");
    expect(result.current.currentIteration).toBe(1);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.phase).toBe("complete");
    expect(result.current.isRunning).toBe(false);
  });

  it("preserves remaining time through pause and resume", () => {
    const { result } = renderHook(() => usePomodoro());

    const quickConfig: PomodoroConfig = {
      ...result.current.config,
      workDuration: 2 / 60,
      restDuration: 1 / 60,
      iterations: 0,
    };

    act(() => {
      result.current.startSession(quickConfig);
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    act(() => {
      result.current.pauseResume();
    });

    expect(result.current.isRunning).toBe(false);
    expect(result.current.remainingSeconds).toBe(1);
    expect(result.current.phaseEndsAt).toBeNull();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.phase).toBe("work");
    expect(result.current.remainingSeconds).toBe(1);

    act(() => {
      result.current.pauseResume();
    });

    act(() => {
      vi.advanceTimersByTime(1001);
    });

    expect(result.current.phase).toBe("rest");
  });

  it("resets the active phase without keeping the clock running", () => {
    const { result } = renderHook(() => usePomodoro());

    const quickConfig: PomodoroConfig = {
      ...result.current.config,
      workDuration: 3 / 60,
      restDuration: 1 / 60,
      iterations: 0,
    };

    act(() => {
      result.current.startSession(quickConfig);
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    act(() => {
      result.current.resetSession();
    });

    expect(result.current.phase).toBe("work");
    expect(result.current.isRunning).toBe(false);
    expect(result.current.phaseEndsAt).toBeNull();
    expect(result.current.remainingSeconds).toBe(3);
  });

  it("skips rest and increments the next work iteration", () => {
    const { result } = renderHook(() => usePomodoro());

    const quickConfig: PomodoroConfig = {
      ...result.current.config,
      workDuration: 1 / 60,
      restDuration: 1 / 60,
      iterations: 3,
    };

    act(() => {
      result.current.startSession(quickConfig);
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.phase).toBe("rest");

    act(() => {
      result.current.skipRest();
    });

    expect(result.current.phase).toBe("work");
    expect(result.current.currentIteration).toBe(2);
  });

  it("persists the session name in local storage", () => {
    const { result, unmount } = renderHook(() => usePomodoro());

    act(() => {
      result.current.setConfig((previousConfig) => ({
        ...previousConfig,
        sessionName: "Writing Sprint",
      }));
    });

    unmount();

    const reloaded = renderHook(() => usePomodoro());
    expect(reloaded.result.current.config.sessionName).toBe("Writing Sprint");
  });

  it("does not rerender the owner component every second while a session is active", () => {
    render(<RenderCountHarness />);

    fireEvent.click(screen.getByRole("button", { name: /start session/i }));
    const renderCountAfterStart = Number(screen.getByTestId("render-count").textContent);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(Number(screen.getByTestId("render-count").textContent)).toBe(
      renderCountAfterStart,
    );
    expect(screen.getByTestId("phase").textContent).toBe("work");
  });
});

function RenderCountHarness() {
  const renderCount = useRef(0);
  const pomodoro = usePomodoro();
  renderCount.current += 1;

  return (
    <div>
      <button
        type="button"
        onClick={() =>
          pomodoro.startSession({
            ...pomodoro.config,
            workDuration: 5 / 60,
            restDuration: 1 / 60,
            iterations: 1,
          })
        }
      >
        Start session
      </button>
      <div data-testid="render-count">{renderCount.current}</div>
      <div data-testid="phase">{pomodoro.phase}</div>
    </div>
  );
}
