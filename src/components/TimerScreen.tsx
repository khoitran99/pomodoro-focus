import { useEffect } from "react";
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Loader2,
  SkipForward,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCountdown } from "@/hooks/useCountdown";
import { cn } from "@/lib/utils";
import type { PomodoroConfig, Phase } from "@/hooks/usePomodoro";
import type { EffectivePerformanceMode } from "@/lib/performance";

interface TimerScreenProps {
  config: PomodoroConfig;
  phase: Phase;
  phaseDurationSeconds: number;
  phaseEndsAt: number | null;
  remainingSeconds: number;
  isRunning: boolean;
  isWaitingForAudio?: boolean;
  currentIteration: number;
  performanceMode: EffectivePerformanceMode;
  onPauseResume: () => void;
  onStop: () => void;
  onReset?: () => void;
  onSkipRest?: () => void;
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export function TimerScreen({
  config,
  phase,
  phaseDurationSeconds,
  phaseEndsAt,
  remainingSeconds,
  isRunning,
  isWaitingForAudio,
  currentIteration,
  performanceMode,
  onPauseResume,
  onStop,
  onReset,
  onSkipRest,
}: TimerScreenProps) {
  const sessionLabel =
    config.sessionName.trim() ||
    (config.workDuration === 25 && config.restDuration === 5
      ? "Pomodoro"
      : "Focus Session");

  const timeLeft = useCountdown({
    endsAt: phaseEndsAt,
    fallbackSeconds: remainingSeconds,
    isActive: isRunning && !isWaitingForAudio,
  });

  const totalTime =
    phaseDurationSeconds ||
    (phase === "work"
      ? Math.round(config.workDuration * 60)
      : Math.round(config.restDuration * 60));

  const progress =
    totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
  const circleRadius = 120;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset =
    circleCircumference - (progress / 100) * circleCircumference;

  useEffect(() => {
    if (phase === "work" || phase === "rest") {
      document.title = `${formatTime(timeLeft)} - ${sessionLabel} | KT Focus`;
    } else {
      document.title = "KT Focus";
    }

    return () => {
      document.title = "KT Focus";
    };
  }, [sessionLabel, timeLeft, phase]);

  return (
    <div className="animate-screen-enter z-10 flex w-full max-w-md flex-col items-center justify-center space-y-12 p-8">
      <div
        className={cn(
          "space-y-2 rounded-3xl border px-8 py-5 text-center transition-all duration-500",
          performanceMode === "immersive"
            ? "border-white/20 bg-white/16 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl"
            : "border-white/12 bg-black/55 shadow-xl",
        )}
      >
        <p
          className="mx-auto max-w-[12ch] text-3xl font-semibold uppercase tracking-[0.18em] text-white sm:text-4xl"
          title={sessionLabel}
        >
          {sessionLabel}
        </p>

        {config.iterations > 0 && phase !== "complete" && (
          <p className="font-medium text-white/80">
            {currentIteration}/{config.iterations}
          </p>
        )}
      </div>

      <div className="relative flex items-center justify-center">
        <div
          className={cn(
            "absolute inset-0 rounded-full bg-white/15",
            performanceMode === "immersive"
              ? "animate-ring-breathe blur-2xl"
              : "animate-ring-breathe-soft blur-xl",
          )}
        />

        <svg className="h-72 w-72 -rotate-90 transform" viewBox="0 0 256 256">
          <circle
            cx="128"
            cy="128"
            r={circleRadius}
            fill="transparent"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          <circle
            cx="128"
            cy="128"
            r={circleRadius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className="text-white"
            style={{
              strokeDasharray: circleCircumference,
              strokeDashoffset,
              transition: isWaitingForAudio
                ? "none"
                : "stroke-dashoffset 1s linear",
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isWaitingForAudio ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-12 w-12 animate-spin text-white" />
              <span className="text-sm font-semibold uppercase tracking-widest text-white">
                Loading Music
              </span>
            </div>
          ) : (
            <span className="text-6xl font-normal tracking-tighter text-white tabular-nums drop-shadow-md">
              {formatTime(timeLeft)}
            </span>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-6">
        <Button
          variant="outline"
          size="icon"
          onClick={onStop}
          className="h-14 w-14 rounded-full border-white/20 bg-white/16 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/24"
        >
          <Square className="h-5 w-5 fill-current" />
        </Button>

        <Button
          size="icon"
          onClick={onPauseResume}
          className={cn(
            "animate-soft-float h-20 w-20 rounded-full border text-white transition-all duration-300 hover:-translate-y-0.5",
            performanceMode === "immersive"
              ? "border-white/20 bg-white/16 shadow-[0_0_20px_rgba(255,255,255,0.12)] hover:bg-white/24"
              : "border-white/14 bg-black/55 hover:bg-black/65",
          )}
        >
          {isRunning ? (
            <Pause className="h-8 w-8 fill-current" />
          ) : (
            <Play className="ml-1 h-8 w-8 fill-current" />
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onReset}
          className="h-14 w-14 rounded-full border-white/20 bg-white/16 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/24"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>

        {phase === "rest" && onSkipRest && (
          <Button
            variant="outline"
            size="icon"
            onClick={onSkipRest}
            className="h-14 w-14 rounded-full border-white/20 bg-white/16 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/24"
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
