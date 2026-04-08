import { useEffect, useRef, type MutableRefObject } from "react";
import type { Phase } from "@/hooks/usePomodoro";

interface SessionNotificationsProps {
  phase: Phase;
  phaseStartedAt: number | null;
  phaseDurationSeconds: number;
  phaseEndsAt: number | null;
  isRunning: boolean;
  isWaitingForAudio: boolean;
}

const CHIME_DURATION_MS = 1500;

export function SessionNotifications({
  phase,
  phaseStartedAt,
  phaseDurationSeconds,
  phaseEndsAt,
  isRunning,
  isWaitingForAudio,
}: SessionNotificationsProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSuspendTimeoutRef = useRef<number | null>(null);
  const spokenPhaseKeysRef = useRef(new Set<number>());
  const chimedPhaseKeysRef = useRef(new Set<number>());

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();

      if (audioSuspendTimeoutRef.current) {
        window.clearTimeout(audioSuspendTimeoutRef.current);
      }

      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        void audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (phase !== "work") {
      window.speechSynthesis?.cancel();
    }
  }, [phase]);

  useEffect(() => {
    if (
      phase !== "work" ||
      !phaseStartedAt ||
      !phaseEndsAt ||
      !isRunning ||
      isWaitingForAudio ||
      phaseDurationSeconds <= 10 ||
      spokenPhaseKeysRef.current.has(phaseStartedAt)
    ) {
      return;
    }

    const delayMs = phaseEndsAt - Date.now() - 10_000;

    if (delayMs <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      if (spokenPhaseKeysRef.current.has(phaseStartedAt)) {
        return;
      }

      spokenPhaseKeysRef.current.add(phaseStartedAt);

      if (!("speechSynthesis" in window)) {
        return;
      }

      const message = new SpeechSynthesisUtterance(
        "Rest section starting in 10 seconds",
      );
      message.rate = 0.9;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(message);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    isRunning,
    isWaitingForAudio,
    phase,
    phaseDurationSeconds,
    phaseEndsAt,
    phaseStartedAt,
  ]);

  useEffect(() => {
    if (
      (phase !== "work" && phase !== "rest") ||
      !phaseStartedAt ||
      !phaseEndsAt ||
      !isRunning ||
      isWaitingForAudio ||
      chimedPhaseKeysRef.current.has(phaseStartedAt)
    ) {
      return;
    }

    const delayMs = phaseEndsAt - Date.now();

    if (delayMs <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      if (chimedPhaseKeysRef.current.has(phaseStartedAt)) {
        return;
      }

      chimedPhaseKeysRef.current.add(phaseStartedAt);
      void playChime(audioContextRef, audioSuspendTimeoutRef);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isRunning, isWaitingForAudio, phase, phaseEndsAt, phaseStartedAt]);

  return null;
}

async function playChime(
  audioContextRef: MutableRefObject<AudioContext | null>,
  audioSuspendTimeoutRef: MutableRefObject<number | null>,
) {
  const AudioContextConstructor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioContextConstructor) {
    return;
  }

  if (!audioContextRef.current || audioContextRef.current.state === "closed") {
    audioContextRef.current = new AudioContextConstructor();
  }

  const audioContext = audioContextRef.current;

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  if (audioSuspendTimeoutRef.current) {
    window.clearTimeout(audioSuspendTimeoutRef.current);
  }

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(
    440,
    audioContext.currentTime + 0.5,
  );

  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.linearRampToValueAtTime(0.18, audioContext.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + 1.25,
  );

  oscillator.start();
  oscillator.stop(audioContext.currentTime + CHIME_DURATION_MS / 1000);

  audioSuspendTimeoutRef.current = window.setTimeout(() => {
    if (audioContextRef.current?.state === "running") {
      void audioContextRef.current.suspend();
    }
  }, CHIME_DURATION_MS + 100);
}
