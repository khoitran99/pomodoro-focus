import { Suspense, lazy } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { usePomodoro } from "@/hooks/usePomodoro";
import { useEffectivePerformanceMode } from "@/hooks/useEffectivePerformanceMode";
import { SetupScreen } from "@/components/SetupScreen";
import { TimerScreen } from "@/components/TimerScreen";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { AudioPlayer } from "@/components/AudioPlayer";
import { FullscreenButton } from "@/components/FullscreenButton";
import { SessionNotifications } from "@/components/SessionNotifications";

export const Route = createFileRoute("/")({
  component: App,
});

const LazyDonationPopup = lazy(() =>
  import("@/components/DonationPopup").then((module) => ({
    default: module.DonationPopup,
  })),
);

function App() {
  const {
    config,
    setConfig,
    phase,
    phaseEndsAt,
    phaseStartedAt,
    phaseDurationSeconds,
    remainingSeconds,
    currentIteration,
    isRunning,
    isWaitingForAudio,
    setIsWaitingForAudio,
    startSession,
    pauseResume,
    stopSession,
    resetSession,
    skipRest,
  } = usePomodoro();

  const effectivePerformanceMode = useEffectivePerformanceMode("auto");

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white font-sans antialiased selection:bg-white/20">
      <AnimatedBackground
        theme={config.theme}
        performanceMode={effectivePerformanceMode}
      />

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6">
        {phase === "setup" ? (
          <SetupScreen
            initialConfig={config}
            effectivePerformanceMode={effectivePerformanceMode}
            onStart={startSession}
            onConfigChange={setConfig}
          />
        ) : (
          <TimerScreen
            config={config}
            currentIteration={currentIteration}
            isRunning={isRunning}
            isWaitingForAudio={isWaitingForAudio}
            phase={phase}
            phaseDurationSeconds={phaseDurationSeconds}
            phaseEndsAt={phaseEndsAt}
            performanceMode={effectivePerformanceMode}
            remainingSeconds={remainingSeconds}
            onPauseResume={pauseResume}
            onReset={resetSession}
            onSkipRest={skipRest}
            onStop={stopSession}
          />
        )}
      </main>

      <AudioPlayer
        phase={phase}
        isRunning={isRunning}
        performanceMode={effectivePerformanceMode}
        setAudioLoading={setIsWaitingForAudio}
      />

      <SessionNotifications
        phase={phase}
        phaseDurationSeconds={phaseDurationSeconds}
        phaseEndsAt={phaseEndsAt}
        phaseStartedAt={phaseStartedAt}
        isRunning={isRunning}
        isWaitingForAudio={isWaitingForAudio}
      />

      <div className="fixed top-6 right-6 z-50">
        <FullscreenButton />
      </div>

      <Suspense fallback={null}>
        <LazyDonationPopup performanceMode={effectivePerformanceMode} />
      </Suspense>
    </div>
  );
}
