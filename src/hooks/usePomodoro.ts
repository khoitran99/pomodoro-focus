import { useState, useEffect, useCallback } from "react";

export type Phase = "work" | "rest" | "complete" | "setup";

export interface PomodoroConfig {
  workDuration: number; // minutes
  restDuration: number; // minutes
  iterations: number; // 0 means infinity
  theme: string;
}

export function usePomodoro() {
  const [config, setConfig] = useState<PomodoroConfig>({
    workDuration: 25,
    restDuration: 5,
    iterations: 0, // infinity by default
    theme: "image-city",
  });

  const [phase, setPhase] = useState<Phase>("setup");
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [currentIteration, setCurrentIteration] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [isWaitingForAudio, setIsWaitingForAudio] = useState(false);

  const startSession = (newConfig?: PomodoroConfig) => {
    if (newConfig) setConfig(newConfig);
    const activeConfig = newConfig || config;
    setPhase("work");
    setCurrentIteration(1);
    setTimeLeft(activeConfig.workDuration * 60);
    setIsRunning(true);
  };

  const pauseResume = () => {
    setIsRunning((prev) => !prev);
  };

  const stopSession = () => {
    setIsRunning(false);
    setPhase("setup");
    setTimeLeft(0);
    setCurrentIteration(1);
  };

  const resetSession = useCallback(() => {
    setTimeLeft(
      phase === "work" ? config.workDuration * 60 : config.restDuration * 60,
    );
    setIsRunning(false);
  }, [phase, config]);

  const transitionPhase = useCallback(() => {
    if (phase === "work") {
      setPhase("rest");
      setTimeLeft(config.restDuration * 60);
    } else if (phase === "rest") {
      // Check if we reached the iteration limit
      if (config.iterations > 0 && currentIteration >= config.iterations) {
        setPhase("complete");
        setIsRunning(false);
        setTimeLeft(0);
      } else {
        setPhase("work");
        setCurrentIteration((prev) => prev + 1);
        setTimeLeft(config.workDuration * 60);
      }
    }
  }, [
    phase,
    config.restDuration,
    config.workDuration,
    config.iterations,
    currentIteration,
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && !isWaitingForAudio && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && !isWaitingForAudio && timeLeft === 0) {
      transitionPhase();
    }

    return () => clearInterval(interval);
  }, [isRunning, isWaitingForAudio, timeLeft, transitionPhase]);

  return {
    config,
    setConfig,
    phase,
    timeLeft,
    currentIteration,
    isRunning,
    isWaitingForAudio,
    setIsWaitingForAudio,
    startSession,
    pauseResume,
    stopSession,
    resetSession,
  };
}
