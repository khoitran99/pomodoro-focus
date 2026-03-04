import { useState, useEffect } from "react";
import { Volume2, VolumeX, Music, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import YouTube, { type YouTubeEvent, type YouTubePlayer } from "react-youtube";
import type { Phase } from "@/hooks/usePomodoro";

const LOFI_PLAYLIST = [
  { id: "jfKfPfyJRdk", title: "Lofi Girl Radio" },
  { id: "4xDzrIxqeac", title: "Lofi Cafe Radio" },
  { id: "rUxyKA_-grg", title: "Japanese Lofi" },
  { id: "7NOSDKb0HlU", title: "Chillhop Radio" },
  { id: "nDq6TstdEi8", title: "Synthwave Beats" },
];

function extractYoutubeId(url: string) {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/,
  );
  return match ? match[1] : null;
}

interface AudioPlayerProps {
  phase: Phase;
  isRunning?: boolean;
  setAudioLoading?: (loading: boolean) => void;
  youtubeUrl?: string;
}

export function AudioPlayer({
  phase,
  isRunning = false,
  setAudioLoading,
  youtubeUrl,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [showVolume, setShowVolume] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);

  const customVideoId = youtubeUrl ? extractYoutubeId(youtubeUrl) : null;
  const activeVideoId = customVideoId || LOFI_PLAYLIST[trackIndex].id;
  const songName = customVideoId
    ? "Custom YT Stream"
    : LOFI_PLAYLIST[trackIndex].title;

  // Auto-hide volume
  useEffect(() => {
    if (showVolume) {
      const timer = setTimeout(() => setShowVolume(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showVolume, volume]);

  useEffect(() => {
    if (player) {
      player.setVolume(volume * 100);
    }
  }, [volume, player]);

  const shouldPlay = isMusicEnabled && phase === "work" && isRunning;

  useEffect(() => {
    if (!player) return;

    if (shouldPlay) {
      if (!isPlaying) {
        setAudioLoading?.(true);
        player.playVideo();
      }
    } else {
      if (isPlaying) {
        player.pauseVideo();
      }
    }
  }, [shouldPlay, player, isPlaying, setAudioLoading]);

  const togglePlay = () => {
    const newEnabledState = !isMusicEnabled;
    setIsMusicEnabled(newEnabledState);

    if (newEnabledState && phase === "work" && isRunning) {
      setAudioLoading?.(true);
      player?.playVideo();
    } else if (!newEnabledState) {
      player?.pauseVideo();
    }
  };

  const nextTrack = () => {
    if (customVideoId) return;
    setTrackIndex((prev) => (prev + 1) % LOFI_PLAYLIST.length);
  };

  const prevTrack = () => {
    if (customVideoId) return;
    setTrackIndex(
      (prev) => (prev - 1 + LOFI_PLAYLIST.length) % LOFI_PLAYLIST.length,
    );
  };

  const onReady = (event: YouTubeEvent) => {
    setPlayer(event.target);
    event.target.setVolume(volume * 100);
    if (shouldPlay) {
      event.target.playVideo();
    } else {
      event.target.pauseVideo();
    }
  };

  const onStateChange = (event: YouTubeEvent) => {
    // 1: PLAYING, 2: PAUSED, 3: BUFFERING
    if (event.data === 1) {
      setIsPlaying(true);
      setAudioLoading?.(false);
    } else if (event.data === 2) {
      setIsPlaying(false);
    } else if (event.data === 3) {
      setAudioLoading?.(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Invisible YouTube Player */}
      <div className="hidden">
        <YouTube
          videoId={activeVideoId}
          onReady={onReady}
          onStateChange={onStateChange}
          opts={{
            playerVars: {
              autoplay: 0,
              controls: 0,
              disablekb: 1,
              loop: 1,
            },
          }}
        />
      </div>

      <AnimatePresence>
        {isPlaying && !showVolume && (
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

      <div className="flex bg-black/60 rounded-full border border-white/10 p-1 shadow-2xl items-center">
        {!customVideoId && (
          <Button
            variant="ghost"
            size="icon"
            onClick={prevTrack}
            className="rounded-full text-white/70 hover:text-white hover:bg-white/10 w-8 h-8 mx-1"
          >
            <SkipBack className="w-4 h-4" />
          </Button>
        )}

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

        {!customVideoId && (
          <Button
            variant="ghost"
            size="icon"
            onClick={nextTrack}
            className="rounded-full text-white/70 hover:text-white hover:bg-white/10 w-8 h-8 mx-1"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowVolume(!showVolume)}
          className="rounded-full text-white/70 hover:text-white hover:bg-white/10 w-10 h-10"
        >
          {volume === 0 ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
