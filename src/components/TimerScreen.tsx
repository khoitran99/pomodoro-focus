import { useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { Play, Pause, Square, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PomodoroConfig, Phase } from "@/hooks/usePomodoro";

interface TimerScreenProps {
  config: PomodoroConfig;
  phase: Phase;
  timeLeft: number;
  isRunning: boolean;
  isWaitingForAudio?: boolean;
  currentIteration: number;
  onPauseResume: () => void;
  onStop: () => void;
  onReset?: () => void;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

export function TimerScreen({
  config,
  phase,
  timeLeft,
  isRunning,
  isWaitingForAudio,
  currentIteration,
  onPauseResume,
  onStop,
  onReset,
}: TimerScreenProps) {
  // Calculate progress circle stroke offset
  const getTotalTime = () =>
    phase === "work" ? config.workDuration * 60 : config.restDuration * 60;
  const progress =
    getTotalTime() > 0
      ? ((getTotalTime() - timeLeft) / getTotalTime()) * 100
      : 0;
  const circleRadius = 120;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset =
    circleCircumference - (progress / 100) * circleCircumference;

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" } as any,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exit: { opacity: 0, scale: 1.1, transition: { duration: 0.4 } as any },
  };

  // Update browser tab title
  useEffect(() => {
    if (phase === "work" || phase === "rest") {
      document.title = `${formatTime(timeLeft)} - KT Focus`;
    } else {
      document.title = "KT Focus";
    }
    return () => {
      document.title = "KT Focus";
    };
  }, [timeLeft, phase]);

  // Play notification chime when time reaches 0
  useEffect(() => {
    if (timeLeft === 0 && (phase === "work" || phase === "rest")) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const AudioContext =
          window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = "sine";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);

        osc.start();
        osc.stop(ctx.currentTime + 1.5);
      } catch (e) {
        console.error("Audio playback error", e);
      }
    }
  }, [timeLeft, phase]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col items-center justify-center p-8 space-y-12 z-10 w-full max-w-md"
    >
      <div className="text-center space-y-2 drop-shadow-md bg-white/20 px-8 py-4 rounded-3xl border border-white/20">
        <h2 className="text-3xl font-light uppercase tracking-widest flex items-center justify-center gap-3">
          {phase === "work" ? (
            <span className="text-white font-semibold">Focus</span>
          ) : phase === "rest" ? (
            <span className="text-white font-semibold">Rest</span>
          ) : (
            <span className="text-white font-semibold">Complete</span>
          )}
        </h2>
        {config.iterations !== 0 && phase !== "complete" && (
          <p className="text-white/80 font-medium">
            Session {currentIteration} of {config.iterations}
          </p>
        )}
        {config.iterations === 0 && (
          <p className="text-white/80 font-medium">
            Session {currentIteration} (Infinite)
          </p>
        )}
      </div>

      <div className="relative flex items-center justify-center">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full blur-2xl opacity-20 bg-white" />

        {/* SVG Progress Circle */}
        <svg className="w-72 h-72 transform -rotate-90" viewBox="0 0 256 256">
          {/* Background Track */}
          <circle
            cx="128"
            cy="128"
            r={circleRadius}
            fill="transparent"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          {/* Progress Track */}
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
              strokeDashoffset: strokeDashoffset,
              transition: "stroke-dashoffset 1s linear",
            }}
          />
        </svg>

        {/* Time Display */}
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          {isWaitingForAudio ? (
            <div className="flex flex-col items-center gap-3 animate-pulse">
              <Loader2 className="w-12 h-12 animate-spin text-white" />
              <span className="text-sm font-semibold uppercase tracking-widest text-white">
                Loading Music
              </span>
            </div>
          ) : (
            <span className="text-6xl font-normal tabular-nums text-white tracking-tighter drop-shadow-md">
              {formatTime(timeLeft)}
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 mt-8">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="outline"
            size="icon"
            onClick={onStop}
            className="w-14 h-14 rounded-full border-white/20 bg-white/20 hover:bg-white/30 text-white"
          >
            <Square className="w-5 h-5 fill-current" />
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="icon"
            onClick={onPauseResume}
            className="w-20 h-20 rounded-full bg-white/20 text-white border border-white/20 hover:bg-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all"
          >
            {isRunning ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current ml-1" />
            )}
          </Button>
        </motion.div>

        {/* Reset button */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="outline"
            size="icon"
            onClick={onReset}
            className="w-14 h-14 rounded-full border-white/20 bg-white/20 hover:bg-white/30 text-white"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
