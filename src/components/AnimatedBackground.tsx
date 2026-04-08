import { memo } from "react";
import { imageThemes } from "@/lib/themes";
import { cn } from "@/lib/utils";
import type { EffectivePerformanceMode } from "@/lib/performance";

interface AnimatedBackgroundProps {
  theme: string;
  performanceMode: EffectivePerformanceMode;
}

export const AnimatedBackground = memo(function AnimatedBackground({
  theme,
  performanceMode,
}: AnimatedBackgroundProps) {
  const imageUrl = imageThemes[theme] || Object.values(imageThemes)[0] || null;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-neutral-950">
      {imageUrl && (
        <img
          key={theme}
          src={imageUrl}
          alt=""
          aria-hidden="true"
          decoding="async"
          fetchPriority="high"
          className={cn(
            "absolute inset-0 h-full w-full object-cover saturate-115 transition-opacity duration-700",
            performanceMode === "immersive"
              ? "animate-ken-burns"
              : "animate-ambient-drift",
          )}
        />
      )}

      <div
        className={cn(
          "absolute -left-28 top-[-8%] h-80 w-80 rounded-full bg-cyan-300/12 mix-blend-screen",
          performanceMode === "immersive"
            ? "animate-float-orb-fast blur-3xl"
            : "animate-float-orb-slow blur-3xl",
        )}
      />

      <div
        className={cn(
          "absolute bottom-[-12%] right-[-10%] h-96 w-96 rounded-full bg-amber-200/12 mix-blend-screen",
          performanceMode === "immersive"
            ? "animate-float-orb-slow blur-3xl"
            : "animate-breathe-gradient blur-3xl",
        )}
      />

      {performanceMode === "immersive" && (
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          }}
        />
      )}
    </div>
  );
});
