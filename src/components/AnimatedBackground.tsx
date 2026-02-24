import { motion, AnimatePresence } from "framer-motion";
import type { Phase } from "@/hooks/usePomodoro";

interface AnimatedBackgroundProps {
  theme: string;
  phase: Phase;
}

const themeGradients: Record<string, string> = {
  midnight: "from-fuchsia-950 via-indigo-950 to-rose-950",
  forest: "from-emerald-950 via-teal-900 to-cyan-950",
  ocean: "from-cyan-950 via-blue-900 to-indigo-950",
};

const imageThemes: Record<string, string> = {
  "image-beach":
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80",
  "image-city":
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1920&q=80",
  "image-coffee":
    "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=1920&q=80",
  "image-study":
    "https://images.unsplash.com/photo-1518655048521-f130df041f66?auto=format&fit=crop&w=1920&q=80",
  "image-forest":
    "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80",
  "image-sky":
    "https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?auto=format&fit=crop&w=1920&q=80",
  "image-galaxy":
    "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1920&q=80",
  "image-mars":
    "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&w=1920&q=80",
  "image-blackhole":
    "https://images.unsplash.com/photo-1462332420958-a05d1e002413?auto=format&fit=crop&w=1920&q=80",
};

const getPhaseColors = (phase: Phase) => {
  switch (phase) {
    case "work":
      return ["#4c1d95", "#1e3a8a", "#4c1d95"];
    case "rest":
      return ["#065f46", "#0f766e", "#065f46"];
    case "complete":
      return ["#701a75", "#86198f", "#701a75"];
    default:
      return ["#1e1b4b", "#312e81", "#1e1b4b"];
  }
};

export function AnimatedBackground({ theme, phase }: AnimatedBackgroundProps) {
  const isImageTheme = theme.startsWith("image-");
  const imageUrl = isImageTheme ? imageThemes[theme] : null;

  const baseGradient = themeGradients[theme] || themeGradients.midnight;
  const phaseColors = getPhaseColors(phase);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-neutral-900 pointer-events-none">
      <AnimatePresence>
        <motion.div
          key={theme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className={`absolute inset-0 bg-linear-to-br transition-colors duration-1000 ${
            !isImageTheme ? baseGradient : ""
          }`}
          style={{ willChange: "transform, opacity" }}
        >
          {/* Image Background with slow pan/zoom (Ken Burns effect) */}
          {isImageTheme && imageUrl && (
            <motion.div
              className="absolute inset-[-10%]" // give room to pan
              style={{
                backgroundImage: `url('${imageUrl}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                willChange: "transform",
              }}
              initial={{ opacity: 0, scale: 1, x: "0%", y: "0%" }}
              animate={{
                opacity: 1,
                scale: [1, 1.05, 1], // Reduced scale range
                x: ["0%", "-1%", "0%"], // Reduced pan range
                y: ["0%", "1%", "0%"],
              }}
              transition={{
                opacity: { duration: 1.5 },
                scale: {
                  duration: 120,
                  ease: "linear",
                  repeat: Infinity,
                  repeatType: "mirror",
                },
                x: {
                  duration: 120,
                  ease: "linear",
                  repeat: Infinity,
                  repeatType: "mirror",
                },
                y: {
                  duration: 120,
                  ease: "linear",
                  repeat: Infinity,
                  repeatType: "mirror",
                },
              }}
            />
          )}

          {/* Floating Gradients - replaced expensive dynamic background generation with pre-computed radial-gradients */}
          {!isImageTheme && (
            <motion.div
              className="absolute inset-0 opacity-30"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${phaseColors[1]} 0%, transparent 70%)`,
                willChange: "transform, opacity",
              }}
              animate={{
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 15, // Breath duration
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
          )}

          {/* Slow floating orb 1 - Replaced expensive blur filter with native radial gradient */}
          {!isImageTheme && (
            <motion.div
              className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] rounded-full sm:w-[50vw] sm:h-[50vw]"
              style={{
                background: `radial-gradient(circle, ${phaseColors[0]} 0%, transparent 60%)`,
                opacity: 0.3,
                willChange: "transform",
              }}
              animate={{
                x: ["0%", "5%", "-5%", "0%"],
                y: ["0%", "-5%", "5%", "0%"],
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />
          )}

          {/* Slow floating orb 2 - Replaced expensive blur filter with native radial gradient */}
          {!isImageTheme && (
            <motion.div
              className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] rounded-full sm:w-[45vw] sm:h-[45vw]"
              style={{
                background: `radial-gradient(circle, ${phaseColors[2]} 0%, transparent 60%)`,
                opacity: 0.25,
                willChange: "transform",
              }}
              animate={{
                x: ["0%", "-5%", "5%", "0%"],
                y: ["0%", "5%", "-5%", "0%"],
              }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Noise texture overlay for premium feel */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-color-burn pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>
    </div>
  );
}
