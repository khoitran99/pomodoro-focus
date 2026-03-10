import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Music, SkipForward, SkipBack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import type { Phase } from "@/hooks/usePomodoro";
import { getAvailableTracks, type AudioTrack } from "@/lib/music";

interface AudioPlayerProps {
  phase: Phase;
  isRunning?: boolean;
  setAudioLoading?: (loading: boolean) => void;
}

export function AudioPlayer({
  phase,
  isRunning = false,
  setAudioLoading,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [showVolume, setShowVolume] = useState(false);

  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayPending = useRef(false);

  // Load tracks on mount
  useEffect(() => {
    const loadedTracks = getAvailableTracks();
    setTracks(loadedTracks);
  }, []);

  const currentTrack = tracks[currentTrackIndex];

  // Auto-hide volume after 3 seconds of inactivity
  useEffect(() => {
    if (showVolume) {
      const timer = setTimeout(() => {
        setShowVolume(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showVolume, volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle Play/Pause logic based on Phase/IsRunning state
  useEffect(() => {
    if (!audioRef.current || tracks.length === 0) return;

    const shouldPlay = isMusicEnabled && phase === "work" && isRunning;

    if (shouldPlay) {
      if (!isPlaying && !isPlayPending.current) {
        isPlayPending.current = true;
        setAudioLoading?.(true);
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            isPlayPending.current = false;
            setAudioLoading?.(false);
          })
          .catch((e) => {
            console.error("Auto-play blocked", e);
            isPlayPending.current = false;
            setAudioLoading?.(false);
            setIsPlaying(false);
          });
      }
    } else {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [
    phase,
    isRunning,
    isMusicEnabled,
    isPlaying,
    setAudioLoading,
    currentTrackIndex,
    tracks.length,
  ]);

  const togglePlay = () => {
    const newEnabledState = !isMusicEnabled;
    setIsMusicEnabled(newEnabledState);

    if (tracks.length === 0) return;

    if (newEnabledState && phase === "work" && isRunning) {
      isPlayPending.current = true;
      setAudioLoading?.(true);
      audioRef.current
        ?.play()
        .then(() => {
          setIsPlaying(true);
          isPlayPending.current = false;
          setAudioLoading?.(false);
        })
        .catch((e) => {
          console.error(e);
          isPlayPending.current = false;
          setAudioLoading?.(false);
        });
    } else if (!newEnabledState) {
      audioRef.current?.pause();
      setIsPlaying(false);
      if (isPlayPending.current) {
        isPlayPending.current = false;
        setAudioLoading?.(false);
      }
    }
  };

  const skipForward = () => {
    if (tracks.length === 0) return;
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
    // Audio will auto-play because src changes and we have a useEffect handling isPlaying
  };

  const skipBackward = () => {
    if (tracks.length === 0) return;
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(prevIndex);
  };

  const handleEnded = () => {
    skipForward();
  };

  // If there are no tracks in the public/music folder, we show a helpful message
  if (tracks.length === 0) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <div className="bg-black/80 text-white/80 px-4 py-2 rounded-full text-xs border border-white/10 backdrop-blur-md">
          Drop audio files in{" "}
          <code className="text-[10px] bg-white/20 px-1 rounded">
            public/music
          </code>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <audio
        ref={audioRef}
        src={currentTrack?.src}
        onEnded={handleEnded}
        // Auto-play when src changes IF it was already playing
        autoPlay={isPlaying}
        preload="auto"
      />

      <AnimatePresence>
        {isPlaying && currentTrack && !showVolume && (
          <motion.div
            initial={{ opacity: 0, x: 20, width: 0 }}
            animate={{ opacity: 1, x: 0, width: "auto" }}
            exit={{ opacity: 0, x: 20, width: 0 }}
            className="overflow-hidden bg-black/60 rounded-full px-4 py-2 flex items-center gap-2 border border-white/10 text-white/80 text-sm font-light whitespace-nowrap backdrop-blur-md shadow-2xl"
          >
            <div className="flex items-center gap-0.5 h-3 mr-1">
              <motion.div
                animate={{ height: [4, 12, 4] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="w-0.5 bg-white rounded-full"
              />
              <motion.div
                animate={{ height: [8, 4, 10, 4] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: 0.2 }}
                className="w-0.5 bg-white rounded-full"
              />
              <motion.div
                animate={{ height: [4, 10, 6, 4] }}
                transition={{ duration: 0.7, repeat: Infinity, delay: 0.4 }}
                className="w-0.5 bg-white rounded-full"
              />
            </div>
            <span className="truncate max-w-48 font-medium">
              {currentTrack.name}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showVolume && (
          <motion.div
            initial={{ opacity: 0, x: 20, width: 0 }}
            animate={{ opacity: 1, x: 0, width: 100 }}
            exit={{ opacity: 0, x: 20, width: 0 }}
            className="overflow-hidden bg-black/60 rounded-full px-3 py-2 flex items-center border border-white/10 backdrop-blur-md shadow-2xl"
          >
            <Slider
              value={[volume]}
              max={1}
              step={0.01}
              onValueChange={([val]) => setVolume(val)}
              className="w-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center bg-black/60 rounded-full border border-white/10 p-1 shadow-2xl backdrop-blur-md gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          onClick={skipBackward}
          className="rounded-full text-white/70 hover:text-white hover:bg-white/10 w-8 h-8"
        >
          <SkipBack className="w-4 h-4 fill-current" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlay}
          className={`rounded-full transition-colors w-10 h-10 ${
            isMusicEnabled
              ? "text-black bg-white hover:bg-white/90"
              : "text-white/70 hover:text-white hover:bg-white/10"
          }`}
        >
          <Music className={`w-5 h-5 ${isPlaying ? "animate-pulse" : ""}`} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={skipForward}
          className="rounded-full text-white/70 hover:text-white hover:bg-white/10 w-8 h-8"
        >
          <SkipForward className="w-4 h-4 fill-current" />
        </Button>

        <div className="w-px h-4 bg-white/20 mx-1"></div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowVolume(!showVolume)}
          className="rounded-full text-white/70 hover:text-white hover:bg-white/10 w-8 h-8"
        >
          {volume === 0 ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
