import { motion, AnimatePresence } from "framer-motion";
import { imageThemes } from "@/lib/themes";

interface AnimatedBackgroundProps {
  theme: string;
}

export function AnimatedBackground({ theme }: AnimatedBackgroundProps) {
  // We exclusively use images now, so we always treat the theme as an image key
  const imageUrl = imageThemes[theme] || null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-neutral-900 pointer-events-none">
      <AnimatePresence>
        <motion.div
          key={theme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 transition-colors duration-1000"
          style={{ willChange: "transform, opacity" }}
        >
          {/* Image Background with slow pan/zoom (Ken Burns effect) */}
          {imageUrl && (
            <motion.div
              className="absolute inset-[-10%] animate-ken-burns" // give room to pan. Uses CSS animation for 0 CPU overhead.
              style={{
                backgroundImage: `url('${imageUrl}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                willChange: "transform",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Noise texture overlay for premium feel - Removed mix-blend-color-burn to drastically improve GPU thermal performance over animating layers */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>
    </div>
  );
}
