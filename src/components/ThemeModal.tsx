import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import { themes } from "@/lib/themes";
import { cn } from "@/lib/utils";
import type { EffectivePerformanceMode } from "@/lib/performance";
import type { ThemeAsset } from "@/lib/media";

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: string;
  onSelectTheme: (themeId: string) => void;
  performanceMode: EffectivePerformanceMode;
}

export function ThemeModal({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  performanceMode,
}: ThemeModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={cn(
        "animate-overlay-fade fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4",
        performanceMode === "immersive" && "backdrop-blur-sm",
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          "animate-modal-enter relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border bg-neutral-900 shadow-2xl",
          performanceMode === "immersive"
            ? "border-white/10"
            : "border-white/12 shadow-xl",
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div>
            <h2 className="text-xl font-bold text-white">Select Theme</h2>
            <p className="text-sm text-white/60">
              Choose a background for your focus sessions
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="scrollbar-hide flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {themes.map((theme) => {
              const isActive = currentTheme === theme.id;

              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => onSelectTheme(theme.id)}
                  className={cn(
                    "group relative aspect-16/10 overflow-hidden rounded-xl transition-all duration-200 focus:outline-none",
                    isActive
                      ? "scale-[0.98] ring-4 ring-white shadow-lg shadow-white/20"
                      : "ring-1 ring-white/10 hover:scale-[1.02] hover:ring-white/30",
                  )}
                >
                  <ThemePreviewImage theme={theme} />

                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-3">
                    <span className="max-w-[80%] truncate text-left text-sm font-medium text-white shadow-sm">
                      {theme.name}
                    </span>
                    {isActive && (
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white">
                        <Check className="h-4 w-4 text-black" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ThemePreviewImage({ theme }: { theme: ThemeAsset }) {
  const [imageSrc, setImageSrc] = useState(theme.thumbnailSrc || theme.fullSrc);

  useEffect(() => {
    setImageSrc(theme.thumbnailSrc || theme.fullSrc);
  }, [theme.fullSrc, theme.thumbnailSrc]);

  return (
    <img
      src={imageSrc}
      alt={`${theme.name} preview`}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (imageSrc !== theme.fullSrc) {
          setImageSrc(theme.fullSrc);
        }
      }}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
  );
}
