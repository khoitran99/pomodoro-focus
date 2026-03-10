import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { themes } from "@/lib/themes";

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: string;
  onSelectTheme: (themeId: string) => void;
}

export function ThemeModal({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
}: ThemeModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-xl font-bold text-white">Select Theme</h2>
              <p className="text-sm text-white/60">
                Choose a background for your focus sessions
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Grid Content */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {themes.map((theme) => {
                const isActive = currentTheme === theme.id;

                return (
                  <button
                    key={theme.id}
                    onClick={() => onSelectTheme(theme.id)}
                    className={`relative group overflow-hidden rounded-xl aspect-16/10 transition-all duration-300 focus:outline-none ${
                      isActive
                        ? "ring-4 ring-white shadow-lg shadow-white/20 scale-[0.98]"
                        : "ring-1 ring-white/10 hover:ring-white/30 hover:shadow-md hover:scale-[1.02]"
                    }`}
                  >
                    {/* Background Preview */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${theme.value})` }}
                    />

                    {/* Dark overlay for readability */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Label */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
                      <span className="text-sm font-medium text-white shadow-sm truncate max-w-[80%] text-left">
                        {theme.name}
                      </span>
                      {isActive && (
                        <div className="flex shrink-0 items-center justify-center w-6 h-6 bg-white rounded-full">
                          <Check className="w-4 h-4 text-black" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
