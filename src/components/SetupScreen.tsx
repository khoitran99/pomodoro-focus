import { Suspense, lazy, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Palette,
  ChevronDown,
  ChevronUp,
  Coffee,
  Settings2,
  Play,
} from "lucide-react";
import { themes } from "@/lib/themes";
import type { EffectivePerformanceMode } from "@/lib/performance";
import type { PomodoroConfig } from "@/hooks/usePomodoro";
import { cn } from "@/lib/utils";

const PRESETS = [
  { id: "pomodoro", name: "Pomodoro", work: 25, rest: 5, icon: Coffee },
  { id: "custom", name: "Custom", work: 0, rest: 0, icon: Settings2 },
] as const;

type PresetId = (typeof PRESETS)[number]["id"];

interface SetupScreenProps {
  initialConfig: PomodoroConfig;
  effectivePerformanceMode: EffectivePerformanceMode;
  onStart: (config: PomodoroConfig) => void;
  onConfigChange?: (config: PomodoroConfig) => void;
}

const LazyThemeModal = lazy(() =>
  import("./ThemeModal").then((module) => ({
    default: module.ThemeModal,
  })),
);

export function SetupScreen({
  initialConfig,
  effectivePerformanceMode,
  onStart,
  onConfigChange,
}: SetupScreenProps) {
  const [config, setConfig] = useState<PomodoroConfig>(initialConfig);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [lastFiniteIterations, setLastFiniteIterations] = useState(
    initialConfig.iterations > 0 ? initialConfig.iterations : 4,
  );
  const [activePreset, setActivePreset] = useState<PresetId>(
    getPresetId(initialConfig),
  );

  useEffect(() => {
    setConfig(initialConfig);

    if (initialConfig.iterations > 0) {
      setLastFiniteIterations(initialConfig.iterations);
    }

    setActivePreset((currentPreset) => {
      const inferredPreset = getPresetId(initialConfig);

      if (currentPreset === "custom" && inferredPreset === "pomodoro") {
        return currentPreset;
      }

      return inferredPreset;
    });
  }, [initialConfig]);

  const isInfinite = config.iterations === 0;
  const currentThemeName =
    themes.find((theme) => theme.id === config.theme)?.name || "Theme";

  const commitConfig = (nextConfig: PomodoroConfig) => {
    setConfig(nextConfig);
    onConfigChange?.(nextConfig);
  };

  const handlePresetClick = (preset: (typeof PRESETS)[number]) => {
    setActivePreset(preset.id);

    if (preset.id === "pomodoro") {
      commitConfig({
        ...config,
        workDuration: preset.work,
        restDuration: preset.rest,
        sessionName: syncSessionName(config.sessionName, preset.id),
      });
      return;
    }

    commitConfig({
      ...config,
      sessionName: syncSessionName(config.sessionName, preset.id),
    });
  };

  const handleStart = () => {
    const sessionConfig = {
      ...config,
      iterations: isInfinite ? 0 : Math.max(1, config.iterations),
    };

    commitConfig(sessionConfig);
    onStart(sessionConfig);
  };

  return (
    <div className="animate-screen-enter z-10 mx-auto w-full max-w-5xl">
      <Card
        className={cn(
          "overflow-hidden rounded-[2rem] border text-white transition-shadow duration-500",
          effectivePerformanceMode === "immersive"
            ? "border-white/16 bg-black/26 shadow-[0_30px_90px_rgba(0,0,0,0.24)] backdrop-blur-2xl"
            : "border-white/16 bg-black/46 shadow-[0_26px_70px_rgba(0,0,0,0.26)] backdrop-blur-xl",
        )}
      >
        <div className="grid md:grid-cols-[minmax(0,1.14fr)_minmax(320px,0.86fr)]">
          <section className="border-b border-white/8 px-5 py-5 md:border-r md:border-b-0 md:px-7 md:py-6">
            <div className="flex h-full flex-col justify-between gap-5">
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-[0.68rem] font-medium uppercase tracking-[0.32em] text-white/50">
                      Classic Focus
                    </p>
                    <h1 className="text-[2.3rem] font-light tracking-tight text-white sm:text-[2.7rem]">
                      {activePreset === "pomodoro"
                        ? "Pomodoro."
                        : "Custom rhythm."}
                    </h1>
                    <p className="max-w-xl text-sm leading-6 text-white/65">
                      {activePreset === "pomodoro"
                        ? "The traditional 25 minute focus block with a clean 5 minute reset, designed to feel calm and ready immediately."
                        : "Tune your own focus and rest balance without losing the same elegant start experience."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsThemeModalOpen(true)}
                    className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/85 transition-colors hover:bg-white/18 focus:outline-none focus:ring-2 focus:ring-white/20"
                  >
                    <Palette className="h-3.5 w-3.5 text-white/70" />
                    <span>{currentThemeName}</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <StatTile label="Focus" value={`${config.workDuration}m`} />
                  <StatTile label="Break" value={`${config.restDuration}m`} />
                  <StatTile
                    label="Rounds"
                    value={isInfinite ? "∞" : `${config.iterations}x`}
                  />
                </div>

                <div className="rounded-[1.65rem] border border-white/10 bg-white/[0.08] p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <div className="min-w-0 flex-1 space-y-2">
                      <label
                        htmlFor="session-name"
                        className="text-[0.72rem] font-medium uppercase tracking-[0.28em] text-white/50"
                      >
                        Session Name
                      </label>
                      <Input
                        id="session-name"
                        type="text"
                        autoComplete="off"
                        maxLength={48}
                        placeholder={
                          activePreset === "pomodoro"
                            ? "Pomodoro"
                            : "Design Review"
                        }
                        value={config.sessionName}
                        onChange={(event) =>
                          commitConfig({
                            ...config,
                            sessionName: event.target.value,
                          })
                        }
                        className="h-12 rounded-2xl border-white/12 bg-black/18 px-4 text-base text-white placeholder:text-white/35 focus-visible:border-white/30 focus-visible:ring-white/18"
                      />
                    </div>

                    <Button
                      onClick={handleStart}
                      className={cn(
                        "h-12 shrink-0 gap-3 rounded-2xl px-6 text-base font-medium text-black transition-all duration-300 hover:-translate-y-0.5 sm:min-w-[185px]",
                        effectivePerformanceMode === "immersive"
                          ? "bg-white shadow-[0_0_38px_-12px_rgba(255,255,255,0.3)] hover:bg-white/92"
                          : "bg-white hover:bg-white/92",
                      )}
                    >
                      <Play className="h-5 w-5 fill-current" />
                      <span>Start Session</span>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="text-xs font-light tracking-wide text-white/34">
                Made by Khoi Tran
              </div>
            </div>
          </section>

          <section className="px-5 py-5 md:px-6 md:py-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2.5">
                {PRESETS.map((preset) => {
                  const isSelected = activePreset === preset.id;
                  const Icon = preset.icon;

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handlePresetClick(preset)}
                      className={cn(
                        "rounded-[1.4rem] border p-3 text-left transition-all duration-300 hover:-translate-y-0.5",
                        isSelected
                          ? "border-transparent bg-white text-black shadow-[0_16px_34px_-14px_rgba(255,255,255,0.42)]"
                          : "border-white/10 bg-white/[0.06] text-white/82 hover:border-white/16 hover:bg-white/[0.1]",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold tracking-wide">
                            {preset.name}
                          </div>
                          <p
                            className={cn(
                              "mt-1 text-xs leading-5",
                              isSelected ? "text-black/60" : "text-white/50",
                            )}
                          >
                            {preset.id === "pomodoro"
                              ? "Traditional 25 / 5"
                              : "Shape your own timings"}
                          </p>
                        </div>
                        <div
                          className={cn(
                            "rounded-2xl border p-2.5",
                            isSelected
                              ? "border-black/8 bg-black/[0.06]"
                              : "border-white/10 bg-white/[0.08]",
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-4.5 w-4.5",
                              isSelected ? "text-black" : "text-white/70",
                            )}
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.07] p-4">
                {activePreset === "pomodoro" ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/78">
                          Traditional Flow
                        </div>
                        <p className="mt-1 text-sm leading-6 text-white/58">
                          Start immediately with the classic cadence. Open
                          advanced settings only if you want infinite mode or a
                          different round count.
                        </p>
                      </div>
                      <div className="min-w-[168px] rounded-[1.3rem] border border-white/10 bg-black/16 px-4 py-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-white/44">
                              Focus
                            </div>
                            <div className="mt-1 text-3xl font-light tracking-tighter text-white tabular-nums">
                              25
                              <span className="ml-1 text-sm text-white/44">
                                min
                              </span>
                            </div>
                          </div>
                          <div className="border-l border-white/8 pl-3">
                            <div className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-white/44">
                              Reset
                            </div>
                            <div className="mt-1 text-3xl font-light tracking-tighter text-white tabular-nums">
                              5
                              <span className="ml-1 text-sm text-white/44">
                                min
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/78">
                        Custom Timers
                      </div>
                      <p className="mt-1 text-sm leading-6 text-white/58">
                        Compact controls for shaping your own focus rhythm.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <RangeField
                        label="Focus"
                        max={120}
                        min={5}
                        step={5}
                        suffix="m"
                        value={config.workDuration}
                        onChange={(value) => {
                          setActivePreset("custom");
                          commitConfig({
                            ...config,
                            workDuration: value,
                            sessionName: syncSessionName(
                              config.sessionName,
                              "custom",
                            ),
                          });
                        }}
                      />

                      <RangeField
                        label="Rest"
                        max={45}
                        min={1}
                        step={1}
                        suffix="m"
                        value={config.restDuration}
                        onChange={(value) => {
                          setActivePreset("custom");
                          commitConfig({
                            ...config,
                            restDuration: value,
                            sessionName: syncSessionName(
                              config.sessionName,
                              "custom",
                            ),
                          });
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex w-full items-center justify-center gap-2 py-1 text-[0.72rem] font-medium uppercase tracking-[0.28em] text-white/42 transition-colors hover:text-white/72"
                >
                  Advanced Settings
                  {showAdvanced ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                <div
                  className={cn(
                    "grid overflow-hidden transition-all duration-300",
                    showAdvanced
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="mt-1 space-y-3 overflow-hidden rounded-[1.35rem] border border-white/8 bg-black/18 p-3.5 backdrop-blur-sm">
                    <div className="flex items-center justify-between gap-4 rounded-[1.15rem] border border-white/8 bg-white/[0.05] px-3.5 py-3">
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
                            if (config.iterations > 0) {
                              setLastFiniteIterations(config.iterations);
                            }

                            commitConfig({
                              ...config,
                              iterations: 0,
                            });
                            return;
                          }

                          commitConfig({
                            ...config,
                            iterations: Math.max(1, lastFiniteIterations),
                          });
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
                      <div className="rounded-[1.15rem] border border-white/8 bg-white/[0.05] px-3.5 py-3">
                        <RangeField
                          label="Iterations"
                          min={1}
                          max={20}
                          step={1}
                          value={config.iterations || 1}
                          onChange={(value) => {
                            setLastFiniteIterations(value);
                            commitConfig({ ...config, iterations: value });
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Card>

      {isThemeModalOpen && (
        <Suspense fallback={null}>
          <LazyThemeModal
            currentTheme={config.theme}
            isOpen={isThemeModalOpen}
            onClose={() => setIsThemeModalOpen(false)}
            onSelectTheme={(themeId) => {
              commitConfig({ ...config, theme: themeId });
            }}
            performanceMode={effectivePerformanceMode}
          />
        </Suspense>
      )}
    </div>
  );
}

function getDefaultSessionName(presetId: PresetId) {
  return presetId === "custom" ? "Custom Session" : "Pomodoro";
}

function syncSessionName(currentName: string, presetId: PresetId) {
  const trimmedName = currentName.trim();

  if (
    trimmedName === "" ||
    trimmedName === getDefaultSessionName("pomodoro") ||
    trimmedName === getDefaultSessionName("custom")
  ) {
    return getDefaultSessionName(presetId);
  }

  return currentName;
}

function getPresetId(config: PomodoroConfig): PresetId {
  const matchingPreset = PRESETS.find(
    (preset) =>
      preset.id !== "custom" &&
      preset.work === config.workDuration &&
      preset.rest === config.restDuration,
  );

  return matchingPreset?.id ?? "custom";
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
        onChange={(event) => onChange(Number(event.target.value))}
        className="range-track h-2 w-full cursor-pointer appearance-none rounded-full bg-white/12 accent-white"
      />
    </div>
  );
}

interface StatTileProps {
  label: string;
  value: string;
}

function StatTile({ label, value }: StatTileProps) {
  return (
    <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.08] px-3 py-3.5">
      <div className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-white/46">
        {label}
      </div>
      <div className="mt-2 text-2xl font-light tracking-tighter text-white">
        {value}
      </div>
    </div>
  );
}
