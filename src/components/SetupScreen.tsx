import { Suspense, lazy, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Palette, Settings2, Play } from "lucide-react";
import type { EffectivePerformanceMode } from "@/lib/performance";
import type { PomodoroConfig } from "@/hooks/usePomodoro";
import { cn } from "@/lib/utils";

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

const LazyCustomSettingsModal = lazy(() =>
  import("./CustomSettingsModal").then((module) => ({
    default: module.CustomSettingsModal,
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
  const [isCustomSettingsOpen, setIsCustomSettingsOpen] = useState(false);

  useEffect(() => {
    setConfig(initialConfig);
  }, [initialConfig]);

  const isClassicPomodoro = isClassicPomodoroConfig(config);
  const customSummary = isClassicPomodoro ? null : formatCustomSummary(config);
  const helperText = isClassicPomodoro
    ? "Name the work you want to protect, then start when it feels clear."
    : "Your custom rhythm is ready. Give this block a name and begin.";
  const displaySessionName = getDisplaySessionName(config);
  const rhythmBadge = isClassicPomodoro
    ? "Traditional 25 / 5 · Infinite"
    : "Custom rhythm saved";

  const commitConfig = (nextConfig: PomodoroConfig) => {
    setConfig(nextConfig);
    onConfigChange?.(nextConfig);
  };

  const handleApplyCustomSettings = (nextConfig: PomodoroConfig) => {
    commitConfig(nextConfig);
    setIsCustomSettingsOpen(false);
  };

  const handleStart = () => {
    const sessionConfig = {
      ...config,
      iterations: config.iterations === 0 ? 0 : Math.max(1, config.iterations),
    };

    commitConfig(sessionConfig);
    onStart(sessionConfig);
  };

  return (
    <div className="animate-screen-enter z-10 mx-auto w-full max-w-[720px] px-4">
      <Card
        className={cn(
          "relative overflow-hidden rounded-[2.75rem] border px-5 py-5 text-white transition-shadow duration-500 sm:px-7 sm:py-7",
          effectivePerformanceMode === "immersive"
            ? "border-white/18 bg-linear-to-br from-slate-950/48 via-slate-950/34 to-black/24 shadow-[0_32px_90px_rgba(0,0,0,0.2)] backdrop-blur-[28px]"
            : "border-white/16 bg-linear-to-br from-black/34 via-black/28 to-black/20 shadow-[0_24px_60px_rgba(0,0,0,0.18)] backdrop-blur-[18px]",
        )}
      >
        <div className="pointer-events-none absolute inset-x-12 top-0 h-36 rounded-full bg-white/8 blur-3xl" />

        <div className="relative space-y-6">
          <div className="space-y-3">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-[0.7rem] font-medium uppercase tracking-[0.24em] text-white/58 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <span className="h-2 w-2 rounded-full bg-white/70" />
              <span className="truncate">{rhythmBadge}</span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2.15rem] border border-white/10 bg-white/[0.06] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-7">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_52%)]" />

            <div className="relative space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="session-name"
                  className="text-[0.7rem] font-medium uppercase tracking-[0.32em] text-white/44"
                >
                  Session Name
                </label>
                <p className="max-w-[32rem] text-sm leading-6 text-white/64 sm:text-[0.95rem]">
                  {helperText}
                </p>
              </div>

              <Input
                id="session-name"
                type="text"
                autoComplete="off"
                spellCheck={false}
                maxLength={48}
                placeholder="What are you focusing on?"
                value={displaySessionName}
                onChange={(event) =>
                  commitConfig({
                    ...config,
                    sessionName: event.target.value,
                  })
                }
                className="h-auto rounded-[1.4rem] border-white/10 bg-black/12 px-5 py-4 text-[clamp(2rem,6vw,3.6rem)] font-medium tracking-[-0.05em] text-white shadow-none placeholder:text-white/24 focus-visible:border-white/18 focus-visible:bg-black/18 focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="space-y-3">
            {customSummary && (
              <p className="text-xs font-medium tracking-[0.22em] text-white/42 uppercase">
                {customSummary}
              </p>
            )}

            <Button
              onClick={handleStart}
              className={cn(
                "h-[3.75rem] w-full gap-3 rounded-full px-7 text-base font-semibold text-black transition-all duration-300 hover:-translate-y-0.5",
                effectivePerformanceMode === "immersive"
                  ? "bg-white shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:bg-white/92"
                  : "bg-white hover:bg-white/92",
              )}
            >
              <Play className="h-5 w-5 fill-current" />
              <span>Start Session</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              aria-label="Open theme picker"
              onClick={() => setIsThemeModalOpen(true)}
              className="h-12 w-full rounded-full border border-white/10 bg-white/[0.08] px-5 text-white hover:bg-white/[0.15]"
            >
              <Palette className="h-4.5 w-4.5 text-white/68" />
              <span>Theme</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              aria-label="Open custom settings"
              onClick={() => setIsCustomSettingsOpen(true)}
              className="h-12 w-full rounded-full border border-white/10 bg-white/[0.06] px-5 text-white hover:bg-white/[0.12]"
            >
              <Settings2 className="h-4.5 w-4.5 text-white/72" />
              <span>Customize</span>
            </Button>
          </div>
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

      {isCustomSettingsOpen && (
        <Suspense fallback={null}>
          <LazyCustomSettingsModal
            config={config}
            isOpen={isCustomSettingsOpen}
            onApply={handleApplyCustomSettings}
            onClose={() => setIsCustomSettingsOpen(false)}
            performanceMode={effectivePerformanceMode}
          />
        </Suspense>
      )}
    </div>
  );
}

function isClassicPomodoroConfig(config: PomodoroConfig) {
  return (
    config.workDuration === 25 &&
    config.restDuration === 5 &&
    config.iterations === 0
  );
}

function getDisplaySessionName(config: PomodoroConfig) {
  const trimmedName = config.sessionName.trim();

  if (trimmedName === "Pomodoro") {
    return "";
  }

  return config.sessionName;
}

function formatCustomSummary(config: PomodoroConfig) {
  return `Custom · ${config.workDuration}m / ${config.restDuration}m · ${
    config.iterations === 0 ? "∞" : `${config.iterations}x`
  }`;
}
