import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { usePomodoro } from "@/hooks/usePomodoro";
import { SetupScreen } from "@/components/SetupScreen";
import { TimerScreen } from "@/components/TimerScreen";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { AudioPlayer } from "@/components/AudioPlayer";
import { DonationPopup } from "@/components/DonationPopup";
import { FullscreenButton } from "@/components/FullscreenButton";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const {
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
  } = usePomodoro();

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white font-sans antialiased selection:bg-white/20">
      <AnimatedBackground
        theme={config.theme}
        phase={phase}
        customBackground={config.customBackground}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {phase === "setup" ? (
            <SetupScreen
              key="setup"
              initialConfig={config}
              onStart={startSession}
              onThemeChange={(theme) => setConfig({ ...config, theme })}
            />
          ) : (
            <TimerScreen
              key="timer"
              config={config}
              phase={phase}
              timeLeft={timeLeft}
              isRunning={isRunning}
              isWaitingForAudio={isWaitingForAudio}
              currentIteration={currentIteration}
              onPauseResume={pauseResume}
              onStop={stopSession}
              onReset={resetSession}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Persistent Audio Controls */}
      <AudioPlayer
        phase={phase}
        isRunning={isRunning}
        setAudioLoading={setIsWaitingForAudio}
        youtubeUrl={config.youtubeUrl}
      />

      {/* Floating Donation Popup */}
      <DonationPopup />

      {/* Floating Fullscreen Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <FullscreenButton />
      </div>
    </div>
  );
}
