import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import type { Phase } from "@/hooks/usePomodoro";

// Reliable Free Lofi radio stream
const LOFI_STREAM_URL = "https://lofi.stream.laut.fm/lofi";

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
  const [isPlaying, setIsPlaying] = useState(false); // actual audio playing state
  const [isMusicEnabled, setIsMusicEnabled] = useState(true); // user preference switch - enabled by default per user request
  const [volume, setVolume] = useState(0.5);
  const [showVolume, setShowVolume] = useState(false);
  const [songName, setSongName] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayPending = useRef(false);

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
    let interval: ReturnType<typeof setInterval>;

    const fetchSong = async () => {
      // Don't poll network or trigger state updates if the tab is hidden
      if (typeof document !== "undefined" && document.hidden) return;

      try {
        const res = await fetch(
          "https://api.laut.fm/station/lofi/current_song",
        );
        if (res.ok) {
          const data = await res.json();
          if (data && data.title && data.artist && data.artist.name) {
            setSongName(`${data.artist.name} - ${data.title}`);
          } else if (data && data.title) {
            setSongName(data.title);
          }
        }
      } catch (e) {
        // ignore errors
      }
    };

    if (isPlaying) {
      if (!songName) setSongName("Loading...");
      fetchSong();
      interval = setInterval(fetchSong, 20000); // Poll every 20 seconds
    } else {
      setSongName("");
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Auto-play/pause based on phase, isRunning, and user preference
  useEffect(() => {
    if (!audioRef.current) return;

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
          });
      }
    } else {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [phase, isRunning, isMusicEnabled, isPlaying, setAudioLoading]);

  const togglePlay = () => {
    const newEnabledState = !isMusicEnabled;
    setIsMusicEnabled(newEnabledState);

    // If we turned it on, but we aren't in a running focus work session,
    // we should still play it right now so the user knows it works,
    // or we only play if we are in a session.
    // The user requirement: "Only the section is running, the music play."
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

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <audio ref={audioRef} src={LOFI_STREAM_URL} loop preload="none" />

      <AnimatePresence>
        {isPlaying && songName && !showVolume && (
          <motion.div
            initial={{ opacity: 0, x: 20, width: 0 }}
            animate={{ opacity: 1, x: 0, width: "auto" }}
            exit={{ opacity: 0, x: 20, width: 0 }}
            className="overflow-hidden bg-black/60 rounded-full px-4 py-2 flex items-center gap-2 border border-white/10 text-white/80 text-sm font-light whitespace-nowrap"
          >
            <div className="flex items-center gap-0.5 h-3">
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
            <span className="truncate max-w-50">{songName}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showVolume && (
          <motion.div
            initial={{ opacity: 0, x: 20, width: 0 }}
            animate={{ opacity: 1, x: 0, width: 100 }}
            exit={{ opacity: 0, x: 20, width: 0 }}
            className="overflow-hidden bg-black/60 rounded-full px-3 py-2 flex items-center border border-white/10"
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

      <div className="flex bg-black/60 rounded-full border border-white/10 p-1 shadow-2xl">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowVolume(!showVolume)}
          className="rounded-full text-white/70 hover:text-white hover:bg-white/10"
        >
          {volume === 0 ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlay}
          className={`rounded-full transition-colors ${isMusicEnabled ? "text-black bg-white hover:bg-white/90" : "text-white/70 hover:text-white hover:bg-white/10"}`}
        >
          <Music className={`w-5 h-5 ${isPlaying ? "animate-pulse" : ""}`} />
        </Button>
      </div>
    </div>
  );
}
