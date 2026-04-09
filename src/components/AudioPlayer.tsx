import { memo, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Music, SkipForward, SkipBack } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Phase } from "@/hooks/usePomodoro";
import type { EffectivePerformanceMode } from "@/lib/performance";
import { audioTracks } from "@/lib/music";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  phase: Phase;
  isRunning?: boolean;
  performanceMode: EffectivePerformanceMode;
  setAudioLoading?: (loading: boolean) => void;
}

export const AudioPlayer = memo(function AudioPlayer({
  phase,
  isRunning = false,
  performanceMode,
  setAudioLoading,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [showVolume, setShowVolume] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const preloadAudioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayPending = useRef(false);
  const lastTrackIdRef = useRef<string | null>(null);

  const currentTrack = audioTracks[currentTrackIndex];
  const shouldLoadTrack = isMusicEnabled && !!currentTrack;
  const shouldPlay = shouldLoadTrack && phase === "work" && isRunning;
  const volumePercent = Math.round(volume * 100);
  const statusLabel = !isMusicEnabled
    ? "Off"
    : shouldPlay
      ? isPlaying
        ? "Live"
        : "Loading"
      : "Idle";

  useEffect(() => {
    if (showVolume) {
      const timeoutId = window.setTimeout(() => {
        setShowVolume(false);
      }, 3000);

      return () => {
        window.clearTimeout(timeoutId);
      };
    }
  }, [showVolume, volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (!shouldLoadTrack || audioTracks.length < 2) {
      preloadAudioRef.current = null;
      return;
    }

    const nextTrack = audioTracks[(currentTrackIndex + 1) % audioTracks.length];

    if (!nextTrack) {
      preloadAudioRef.current = null;
      return;
    }

    const preloadAudio =
      preloadAudioRef.current ?? document.createElement("audio");

    preloadAudio.preload = "auto";

    if (preloadAudio.getAttribute("src") !== nextTrack.src) {
      preloadAudio.src = nextTrack.src;
    }

    preloadAudioRef.current = preloadAudio;
  }, [currentTrackIndex, shouldLoadTrack]);

  useEffect(() => {
    const audioElement = audioRef.current;

    if (!audioElement || !currentTrack) {
      return;
    }

    const trackChanged = lastTrackIdRef.current !== currentTrack.id;
    lastTrackIdRef.current = currentTrack.id;

    if (!shouldPlay) {
      if (!audioElement.paused) {
        audioElement.pause();
      }

      isPlayPending.current = false;
      setIsPlaying(false);
      setAudioLoading?.(false);
      return;
    }

    if (isPlayPending.current || (!trackChanged && isPlaying)) {
      return;
    }

    isPlayPending.current = true;
    setAudioLoading?.(true);

    void audioElement
      .play()
      .then(() => {
        isPlayPending.current = false;
        setAudioLoading?.(false);
        setIsPlaying(true);
      })
      .catch((error) => {
        console.error("Auto-play blocked", error);
        isPlayPending.current = false;
        setAudioLoading?.(false);
        setIsPlaying(false);
      });
  }, [currentTrack, isPlaying, setAudioLoading, shouldPlay]);

  const togglePlay = () => {
    const nextEnabledState = !isMusicEnabled;
    setIsMusicEnabled(nextEnabledState);

    if (!nextEnabledState) {
      audioRef.current?.pause();
      isPlayPending.current = false;
      setIsPlaying(false);
      setAudioLoading?.(false);
    }
  };

  const selectTrack = (getNextIndex: (previousIndex: number) => number) => {
    if (audioTracks.length === 0) {
      return;
    }

    audioRef.current?.pause();
    isPlayPending.current = false;
    setIsPlaying(false);
    setAudioLoading?.(false);
    setCurrentTrackIndex((previousIndex) => getNextIndex(previousIndex));
  };

  const skipForward = () => {
    selectTrack(
      (previousIndex) => (previousIndex + 1) % audioTracks.length,
    );
  };

  const skipBackward = () => {
    selectTrack(
      (previousIndex) =>
        (previousIndex - 1 + audioTracks.length) % audioTracks.length,
    );
  };

  if (audioTracks.length === 0) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <div className="rounded-full border border-white/10 bg-black/80 px-4 py-2 text-xs text-white/80">
          Audio tracks are currently unavailable.
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 sm:inset-x-auto sm:right-6 sm:bottom-6">
      <audio
        key={currentTrack?.id ?? "audio-track"}
        ref={audioRef}
        src={shouldLoadTrack ? currentTrack?.src : undefined}
        onEnded={skipForward}
        preload={shouldLoadTrack ? "auto" : "none"}
      />

      <div
        className={cn(
          "relative w-full min-w-0 overflow-hidden rounded-[1.65rem] border px-3 py-2.5 sm:w-[min(620px,calc(100vw-3rem))] sm:px-4 sm:py-3",
          performanceMode === "immersive"
            ? "border-white/12 bg-black/42 shadow-[0_22px_54px_rgba(0,0,0,0.24)] backdrop-blur-xl"
            : "border-white/12 bg-black/62 shadow-[0_18px_36px_rgba(0,0,0,0.24)]",
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(circle at top left, rgba(103,232,249,0.18), transparent 42%), radial-gradient(circle at bottom right, rgba(253,224,71,0.16), transparent 38%), linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.02))",
          }}
        />

        {showVolume && (
          <div
            className={cn(
              "absolute right-3 bottom-[calc(100%+0.55rem)] z-10 w-44 overflow-hidden rounded-[1.45rem] border px-4 py-3",
              performanceMode === "immersive"
                ? "border-white/12 bg-black/48 shadow-[0_18px_40px_rgba(0,0,0,0.24)] backdrop-blur-xl"
                : "border-white/12 bg-black/68 shadow-[0_18px_36px_rgba(0,0,0,0.24)]",
            )}
          >
            <div className="relative">
              <div className="flex items-center justify-between text-[0.65rem] font-medium uppercase tracking-[0.28em] text-white/50">
                <span>Volume</span>
                <span>{volumePercent}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(event) => setVolume(Number(event.target.value))}
                className="range-track mt-3 w-full cursor-pointer appearance-none rounded-full bg-white/12 accent-white"
                aria-label="Adjust music volume"
              />
            </div>
          </div>
        )}

        <div className="relative flex items-center gap-3 sm:gap-4">
          {currentTrack && (
            <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] border",
                  isMusicEnabled
                    ? "border-white/14 bg-white/14 text-white shadow-[0_10px_24px_rgba(255,255,255,0.08)]"
                    : "border-white/10 bg-white/8 text-white/45",
                )}
              >
                {isMusicEnabled ? (
                  <Music className="h-5 w-5" />
                ) : (
                  <VolumeX className="h-5 w-5" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[0.58rem] font-medium uppercase tracking-[0.24em] text-white/44">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full transition-colors duration-300",
                      shouldPlay && isPlaying
                        ? "bg-emerald-300 shadow-[0_0_12px_rgba(134,239,172,0.8)]"
                        : "bg-white/28",
                    )}
                  />
                  <span>{statusLabel}</span>
                </div>
                <div
                  className="mt-0.5 truncate text-sm font-semibold text-white sm:text-[0.98rem]"
                  title={currentTrack.name}
                >
                  {currentTrack.name}
                </div>
              </div>

              <div className="ml-1 hidden shrink-0 items-end gap-1 self-stretch sm:flex">
                {[14, 22, 17].map((height, index) => (
                  <span
                    key={height}
                    className={cn(
                      "audio-bar w-1 rounded-full bg-white/75",
                      shouldPlay && isPlaying ? "opacity-95" : "opacity-30",
                    )}
                    style={{
                      height,
                      animationDelay: `-${index * 0.18}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
            <div className="mx-0.5 hidden h-7 w-px bg-white/10 sm:block" />
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Previous track"
                onClick={skipBackward}
                className="h-9 w-9 rounded-[0.95rem] text-white/70 hover:bg-white/10 hover:text-white"
              >
                <SkipBack className="h-4 w-4 fill-current" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                aria-label={isMusicEnabled ? "Disable music" : "Enable music"}
                onClick={togglePlay}
                className={cn(
                  "animate-soft-float h-10 w-10 rounded-[1rem] border transition-all duration-300",
                  isMusicEnabled
                    ? "border-white/25 bg-white text-black shadow-[0_10px_28px_rgba(255,255,255,0.22)] hover:bg-white/92"
                    : "border-white/10 bg-white/[0.08] text-white/70 hover:bg-white/[0.14] hover:text-white",
                )}
              >
                <Music className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                aria-label="Next track"
                onClick={skipForward}
                className="h-9 w-9 rounded-[0.95rem] text-white/70 hover:bg-white/10 hover:text-white"
              >
                <SkipForward className="h-4 w-4 fill-current" />
              </Button>

              <div className="mx-0.5 h-5 w-px bg-white/12" />

              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle volume controls"
                onClick={() => setShowVolume((previous) => !previous)}
                className="h-9 w-9 rounded-[0.95rem] text-white/70 hover:bg-white/10 hover:text-white"
              >
                {volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
