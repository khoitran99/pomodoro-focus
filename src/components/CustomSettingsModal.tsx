import { useEffect, useState } from "react";
import { RotateCcw, X } from "lucide-react";
import type { PomodoroConfig } from "@/hooks/usePomodoro";
import type { EffectivePerformanceMode } from "@/lib/performance";
import { cn } from "@/lib/utils";

interface CustomSettingsModalProps {
  config: PomodoroConfig;
  isOpen: boolean;
  onApply: (config: PomodoroConfig) => void;
  onClose: () => void;
  performanceMode: EffectivePerformanceMode;
}

export function CustomSettingsModal({
  config,
  isOpen,
  onApply,
  onClose,
  performanceMode,
}: CustomSettingsModalProps) {
  const [draftConfig, setDraftConfig] = useState<PomodoroConfig>(config);
  const [lastFiniteIterations, setLastFiniteIterations] = useState(
    config.iterations > 0 ? config.iterations : 4,
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setDraftConfig(config);
    setLastFiniteIterations(config.iterations > 0 ? config.iterations : 4);
  }, [config, isOpen]);

  if (!isOpen) {
    return null;
  }

  const isInfinite = draftConfig.iterations === 0;

  return (
    <div
      className={cn(
        "animate-overlay-fade fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4",
        performanceMode === "immersive" && "backdrop-blur-sm",
      )}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Custom settings"
        className={cn(
          "animate-modal-enter relative flex max-h-[88vh] w-full max-w-[34rem] flex-col overflow-hidden rounded-[2.25rem] border bg-linear-to-br from-neutral-950/96 via-neutral-950/90 to-black/92 shadow-2xl",
          performanceMode === "immersive"
            ? "border-white/10"
            : "border-white/12 shadow-xl",
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/8 p-6">
          <div className="space-y-2">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.32em] text-white/46">
              Customize
            </p>
            <h2 className="text-2xl font-medium tracking-tight text-white">
              Shape the session.
            </h2>
            <p className="text-sm leading-6 text-white/58">
              Adjust timing only when you need something beyond the classic
              Pomodoro flow.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close custom settings"
            className="rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="scrollbar-hide flex-1 overflow-y-auto p-6">
          <div className="space-y-5">
            <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.05] px-4 py-3.5">
              <p className="text-sm font-medium text-white/72">
                {formatDraftSummary(draftConfig)}
              </p>
            </div>

            <div className="space-y-4 rounded-[1.6rem] border border-white/8 bg-white/[0.05] p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <RangeField
                  label="Focus"
                  max={120}
                  min={5}
                  step={5}
                  suffix="m"
                  value={draftConfig.workDuration}
                  onChange={(value) =>
                    setDraftConfig((previousConfig) => ({
                      ...previousConfig,
                      workDuration: value,
                    }))
                  }
                />

                <RangeField
                  label="Break"
                  max={45}
                  min={1}
                  step={1}
                  suffix="m"
                  value={draftConfig.restDuration}
                  onChange={(value) =>
                    setDraftConfig((previousConfig) => ({
                      ...previousConfig,
                      restDuration: value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-3 rounded-[1.6rem] border border-white/8 bg-white/[0.05] p-4">
              <div className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-white/8 bg-black/18 px-4 py-3.5">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-white/90">
                    Infinite Mode
                  </div>
                  <p className="mt-1 text-xs text-white/52">
                    Repeat sessions forever
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={isInfinite}
                  aria-label="Toggle infinite mode"
                  onClick={() => {
                    const nextInfinite = !isInfinite;

                    if (nextInfinite) {
                      if (draftConfig.iterations > 0) {
                        setLastFiniteIterations(draftConfig.iterations);
                      }

                      setDraftConfig((previousConfig) => ({
                        ...previousConfig,
                        iterations: 0,
                      }));
                      return;
                    }

                    setDraftConfig((previousConfig) => ({
                      ...previousConfig,
                      iterations: Math.max(1, lastFiniteIterations),
                    }));
                  }}
                  className={cn(
                    "inline-flex h-8 w-14 shrink-0 items-center rounded-full border p-1 transition-all duration-300",
                    isInfinite
                      ? "border-white/20 bg-white shadow-[0_0_24px_rgba(255,255,255,0.22)]"
                      : "border-white/20 bg-white/12",
                  )}
                >
                  <span
                    className={cn(
                      "block h-6 w-6 rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.35)] transition-transform duration-300",
                      isInfinite
                        ? "translate-x-6 bg-black"
                        : "translate-x-0 bg-white",
                    )}
                  />
                </button>
              </div>

              {!isInfinite && (
                <div className="rounded-[1.25rem] border border-white/8 bg-black/18 px-4 py-3.5">
                  <RangeField
                    label="Iterations"
                    min={1}
                    max={20}
                    step={1}
                    value={draftConfig.iterations || 1}
                    onChange={(value) => {
                      setLastFiniteIterations(value);
                      setDraftConfig((previousConfig) => ({
                        ...previousConfig,
                        iterations: value,
                      }));
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/8 p-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => {
              setLastFiniteIterations(4);
              setDraftConfig((previousConfig) => ({
                ...previousConfig,
                workDuration: 25,
                restDuration: 5,
                iterations: 0,
              }));
            }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white/68 transition-colors hover:bg-white/10 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset to Classic Pomodoro</span>
          </button>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onApply(draftConfig)}
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-white/92"
            >
              Apply Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface RangeFieldProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  suffix?: string;
  onChange: (value: number) => void;
}

function RangeField({
  label,
  min,
  max,
  step,
  value,
  suffix,
  onChange,
}: RangeFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-4">
        <span className="text-[0.72rem] font-medium uppercase tracking-[0.28em] text-white/55">
          {label}
        </span>
        <div className="text-lg font-light tracking-tighter tabular-nums text-white">
          {value}
          {suffix && (
            <span className="ml-1 text-xs font-normal text-white/40">
              {suffix}
            </span>
          )}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(event) => onChange(Number(event.target.value))}
        className="range-track h-2 w-full cursor-pointer appearance-none rounded-full bg-white/12 accent-white"
      />
    </div>
  );
}

function formatDraftSummary(config: PomodoroConfig) {
  return `${config.workDuration}m focus · ${config.restDuration}m break · ${
    config.iterations === 0 ? "Infinite rounds" : `${config.iterations} rounds`
  }`;
}
