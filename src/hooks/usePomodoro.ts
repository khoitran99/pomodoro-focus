import { useCallback, useEffect, useRef, useState } from "react";
import { themes } from "@/lib/themes";
import { type PerformanceMode } from "@/lib/performance";
import { getSecondsRemaining } from "@/hooks/useCountdown";

export type Phase = "work" | "rest" | "complete" | "setup";

export interface PomodoroConfig {
  sessionName: string;
  workDuration: number;
  restDuration: number;
  iterations: number;
  theme: string;
  performanceMode: PerformanceMode;
}

const STORAGE_KEY = "kt-focus:settings:v2";

const defaultThemeId =
  themes.find((theme) => theme.id.includes("sebastian"))?.id ||
  themes[0]?.id ||
  "bg-sebastian-svenson-lpbydenbqqg-unsplash";

const defaultConfig: PomodoroConfig = {
  sessionName: "Pomodoro",
  workDuration: 25,
  restDuration: 5,
  iterations: 0,
  theme: defaultThemeId,
  performanceMode: "auto",
};

function isTimerPhase(phase: Phase): phase is "work" | "rest" {
  return phase === "work" || phase === "rest";
}

function sanitizeConfig(candidate?: Partial<PomodoroConfig>): PomodoroConfig {
  const sessionName =
    typeof candidate?.sessionName === "string"
      ? candidate.sessionName.replace(/\s+/g, " ").trim().slice(0, 48)
      : defaultConfig.sessionName;

  const workDuration =
    typeof candidate?.workDuration === "number" && candidate.workDuration > 0
      ? candidate.workDuration
      : defaultConfig.workDuration;

  const restDuration =
    typeof candidate?.restDuration === "number" && candidate.restDuration > 0
      ? candidate.restDuration
      : defaultConfig.restDuration;

  const iterations =
    typeof candidate?.iterations === "number" && Number.isFinite(candidate.iterations)
      ? Math.max(0, Math.round(candidate.iterations))
      : defaultConfig.iterations;

  const theme =
    candidate?.theme &&
    themes.some((knownTheme) => knownTheme.id === candidate.theme)
      ? candidate.theme
      : defaultConfig.theme;

  return {
    sessionName,
    workDuration,
    restDuration,
    iterations,
    theme,
    performanceMode: defaultConfig.performanceMode,
  };
}

function getPhaseDurationSeconds(phase: "work" | "rest", config: PomodoroConfig) {
  return Math.max(
    1,
    Math.round((phase === "work" ? config.workDuration : config.restDuration) * 60),
  );
}

function loadStoredConfig() {
  if (typeof window === "undefined") {
    return defaultConfig;
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return defaultConfig;
    }

    return sanitizeConfig(JSON.parse(rawValue) as Partial<PomodoroConfig>);
  } catch {
    return defaultConfig;
  }
}

export function usePomodoro() {
  const [configState, setConfigState] = useState<PomodoroConfig>(loadStoredConfig);
  const [phase, setPhase] = useState<Phase>("setup");
  const [phaseStartedAt, setPhaseStartedAt] = useState<number | null>(null);
  const [phaseEndsAt, setPhaseEndsAt] = useState<number | null>(null);
  const [phaseDurationSeconds, setPhaseDurationSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [currentIteration, setCurrentIteration] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [isWaitingForAudio, setIsWaitingForAudio] = useState(false);
  const previousWaitingForAudioRef = useRef(false);

  const setConfig = useCallback(
    (
      nextConfig:
        | PomodoroConfig
        | ((previousConfig: PomodoroConfig) => PomodoroConfig),
    ) => {
      setConfigState((previousConfig) =>
        sanitizeConfig(
          typeof nextConfig === "function"
            ? nextConfig(previousConfig)
            : nextConfig,
        ),
      );
    },
    [],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(configState));
  }, [configState]);

  const transitionPhase = useCallback(() => {
    if (phase === "work") {
      const nextDuration = getPhaseDurationSeconds("rest", configState);
      const now = Date.now();

      setPhase("rest");
      setPhaseStartedAt(now);
      setPhaseDurationSeconds(nextDuration);
      setRemainingSeconds(nextDuration);
      setPhaseEndsAt(isWaitingForAudio ? null : now + nextDuration * 1000);
      return;
    }

    if (phase === "rest") {
      if (configState.iterations > 0 && currentIteration >= configState.iterations) {
        setPhase("complete");
        setPhaseStartedAt(Date.now());
        setPhaseDurationSeconds(0);
        setRemainingSeconds(0);
        setPhaseEndsAt(null);
        setIsRunning(false);
        return;
      }

      const nextDuration = getPhaseDurationSeconds("work", configState);
      const nextIteration = currentIteration + 1;
      const now = Date.now();

      setPhase("work");
      setCurrentIteration(nextIteration);
      setPhaseStartedAt(now);
      setPhaseDurationSeconds(nextDuration);
      setRemainingSeconds(nextDuration);
      setPhaseEndsAt(isWaitingForAudio ? null : now + nextDuration * 1000);
    }
  }, [configState, currentIteration, isWaitingForAudio, phase]);

  const startSession = useCallback(
    (nextConfig?: PomodoroConfig) => {
      const activeConfig = sanitizeConfig(nextConfig ?? configState);
      const nextDuration = getPhaseDurationSeconds("work", activeConfig);
      const now = Date.now();

      if (nextConfig) {
        setConfigState(activeConfig);
      }

      setPhase("work");
      setCurrentIteration(1);
      setPhaseStartedAt(now);
      setPhaseDurationSeconds(nextDuration);
      setRemainingSeconds(nextDuration);
      setPhaseEndsAt(now + nextDuration * 1000);
      setIsWaitingForAudio(false);
      setIsRunning(true);
    },
    [configState],
  );

  const pauseResume = useCallback(() => {
    if (!isTimerPhase(phase)) {
      return;
    }

    if (isRunning) {
      if (phaseEndsAt) {
        setRemainingSeconds(getSecondsRemaining(phaseEndsAt));
      }
      setPhaseEndsAt(null);
      setIsRunning(false);
      return;
    }

    if (isWaitingForAudio || remainingSeconds <= 0) {
      return;
    }

    setPhaseEndsAt(Date.now() + remainingSeconds * 1000);
    setIsRunning(true);
  }, [isRunning, isWaitingForAudio, phase, phaseEndsAt, remainingSeconds]);

  const stopSession = useCallback(() => {
    setPhase("setup");
    setPhaseStartedAt(null);
    setPhaseDurationSeconds(0);
    setRemainingSeconds(0);
    setPhaseEndsAt(null);
    setCurrentIteration(1);
    setIsRunning(false);
    setIsWaitingForAudio(false);
  }, []);

  const resetSession = useCallback(() => {
    if (!isTimerPhase(phase)) {
      return;
    }

    const nextDuration = getPhaseDurationSeconds(phase, configState);

    setPhaseStartedAt(Date.now());
    setPhaseDurationSeconds(nextDuration);
    setRemainingSeconds(nextDuration);
    setPhaseEndsAt(null);
    setIsWaitingForAudio(false);
    setIsRunning(false);
  }, [configState, phase]);

  const skipRest = useCallback(() => {
    if (phase === "rest") {
      transitionPhase();
    }
  }, [phase, transitionPhase]);

  useEffect(() => {
    if (!isTimerPhase(phase) || !isRunning) {
      previousWaitingForAudioRef.current = isWaitingForAudio;
      return;
    }

    const wasWaitingForAudio = previousWaitingForAudioRef.current;
    previousWaitingForAudioRef.current = isWaitingForAudio;

    if (isWaitingForAudio && !wasWaitingForAudio) {
      if (phaseEndsAt) {
        setRemainingSeconds(getSecondsRemaining(phaseEndsAt));
      }
      setPhaseEndsAt(null);
      return;
    }

    if (
      !isWaitingForAudio &&
      wasWaitingForAudio &&
      !phaseEndsAt &&
      remainingSeconds > 0
    ) {
      setPhaseEndsAt(Date.now() + remainingSeconds * 1000);
    }
  }, [isRunning, isWaitingForAudio, phase, phaseEndsAt, remainingSeconds]);

  useEffect(() => {
    if (!isRunning || isWaitingForAudio || !phaseEndsAt || !isTimerPhase(phase)) {
      return;
    }

    const delayMs = Math.max(0, phaseEndsAt - Date.now());

    const timeoutId = window.setTimeout(() => {
      setRemainingSeconds(0);
      transitionPhase();
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isRunning, isWaitingForAudio, phase, phaseEndsAt, transitionPhase]);

  return {
    config: configState,
    setConfig,
    currentIteration,
    isRunning,
    isWaitingForAudio,
    phase,
    phaseDurationSeconds,
    phaseEndsAt,
    phaseStartedAt,
    remainingSeconds,
    resetSession,
    pauseResume,
    setIsWaitingForAudio,
    skipRest,
    startSession,
    stopSession,
  };
}
