import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Palette,
  ChevronDown,
  ChevronUp,
  Brain,
  Zap,
  Coffee,
  Settings2,
  Play,
} from "lucide-react";
import { ThemeModal } from "./ThemeModal";
import { themes } from "@/lib/themes";
import type { PomodoroConfig } from "@/hooks/usePomodoro";
import { cn } from "@/lib/utils";

const PRESETS = [
  { id: "pomodoro", name: "Pomodoro", work: 25, rest: 5, icon: Coffee },
  { id: "deepwork", name: "Deep Work", work: 90, rest: 15, icon: Brain },
  { id: "sprint", name: "Short Sprint", work: 15, rest: 3, icon: Zap },
  { id: "custom", name: "Custom", work: 0, rest: 0, icon: Settings2 },
] as const;
type PresetId = (typeof PRESETS)[number]["id"];

interface SetupScreenProps {
  initialConfig: PomodoroConfig;
  onStart: (config: PomodoroConfig) => void;
  onThemeChange?: (theme: string) => void;
}

export function SetupScreen({
  initialConfig,
  onStart,
  onThemeChange,
}: SetupScreenProps) {
  const [config, setConfig] = useState<PomodoroConfig>(initialConfig);
  const [isInfinite, setIsInfinite] = useState(initialConfig.iterations === 0);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Custom mode triggers when users adjust sliders manually or select 'Custom' directly.
  const [activePreset, setActivePreset] = useState<PresetId>("pomodoro");

  const handlePresetClick = (preset: (typeof PRESETS)[number]) => {
    setActivePreset(preset.id);
    if (preset.id !== "custom") {
      setConfig({
        ...config,
        workDuration: preset.work,
        restDuration: preset.rest,
      });
    }
  };

  const handleStart = () => {
    onStart({
      ...config,
      iterations: isInfinite ? 0 : config.iterations,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md mx-auto z-10"
    >
      <Card className="bg-black/20 dark:bg-black/30 backdrop-blur-3xl border-white/10 shadow-2xl text-white overflow-hidden rounded-[2rem]">
        <CardContent className="space-y-6 px-8">
          {/* Preset Mode Tiles */}
          <div className="grid grid-cols-2 gap-3">
            {PRESETS.map((preset) => {
              const isSelected = activePreset === preset.id;
              const Icon = preset.icon;
              return (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  key={preset.id}
                  onClick={() => handlePresetClick(preset)}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-2xl border transition-colors duration-200",
                    isSelected
                      ? "bg-white text-black border-transparent shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)]"
                      : "bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:border-white/10 hover:text-white",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-6 h-6 mb-2 transition-colors",
                      isSelected
                        ? "text-black"
                        : "text-white/50 group-hover:text-white",
                    )}
                  />
                  <span className="text-sm font-semibold tracking-wide">
                    {preset.name}
                  </span>
                  {preset.id !== "custom" && (
                    <span
                      className={cn(
                        "text-xs mt-1 font-medium",
                        isSelected ? "text-black/60" : "text-white/40",
                      )}
                    >
                      {preset.work}m / {preset.rest}m
                    </span>
                  )}
                  {preset.id === "custom" && (
                    <span
                      className={cn(
                        "text-xs mt-1 font-medium",
                        isSelected ? "text-black/60" : "text-white/40",
                      )}
                    >
                      Set timers
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          <motion.div
            initial={false}
            animate={{
              height: activePreset === "custom" ? "auto" : 0,
              opacity: activePreset === "custom" ? 1 : 0,
            }}
            className="overflow-hidden"
          >
            {/* Custom Control Sliders */}
            <div className="space-y-6 pt-2 pb-2">
              <div className="space-y-3">
                <div className="flex justify-between items-end mb-1">
                  <Label className="text-white/60 text-sm font-medium uppercase tracking-wider">
                    Deep Work
                  </Label>
                  <div className="text-2xl font-light tabular-nums tracking-tighter">
                    {config.workDuration}
                    <span className="text-sm text-white/40 ml-1 font-normal">
                      m
                    </span>
                  </div>
                </div>
                <Slider
                  value={[config.workDuration]}
                  onValueChange={([val]) => {
                    setActivePreset("custom"); // Ensure custom is active if dragging
                    setConfig({ ...config, workDuration: val });
                  }}
                  max={120}
                  min={5}
                  step={5}
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end mb-1">
                  <Label className="text-white/60 text-sm font-medium uppercase tracking-wider">
                    Rest
                  </Label>
                  <div className="text-2xl font-light tabular-nums tracking-tighter">
                    {config.restDuration}
                    <span className="text-sm text-white/40 ml-1 font-normal">
                      m
                    </span>
                  </div>
                </div>
                <Slider
                  value={[config.restDuration]}
                  onValueChange={([val]) => {
                    setActivePreset("custom");
                    setConfig({ ...config, restDuration: val });
                  }}
                  max={45}
                  min={1}
                  step={1}
                />
              </div>
            </div>
          </motion.div>

          {/* Secondary Controls Togggle */}
          <div className="pt-2">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-center w-full py-2 gap-2 text-xs font-medium text-white/40 hover:text-white/70 transition-colors uppercase tracking-widest"
            >
              Advanced Settings
              {showAdvanced ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            <motion.div
              initial={false}
              animate={{
                height: showAdvanced ? "auto" : 0,
                opacity: showAdvanced ? 1 : 0,
              }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-4 mt-2 p-5 bg-white/5 border border-white/5 rounded-2xl">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="infinite-mode"
                    className="flex flex-col gap-1"
                  >
                    <span className="font-medium text-white/90">
                      Infinite Mode
                    </span>
                    <span className="font-normal text-xs text-white/50">
                      Repeat sessions forever
                    </span>
                  </Label>
                  <Switch
                    id="infinite-mode"
                    checked={isInfinite}
                    onCheckedChange={setIsInfinite}
                  />
                </div>

                {!isInfinite && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-2 space-y-3"
                  >
                    <div className="flex justify-between items-end">
                      <Label className="text-white/90">Iterations</Label>
                      <span className="text-lg font-medium tabular-nums">
                        {config.iterations}
                      </span>
                    </div>
                    <Slider
                      value={[config.iterations || 1]}
                      onValueChange={([val]) =>
                        setConfig({ ...config, iterations: val })
                      }
                      max={20}
                      min={1}
                      step={1}
                      className="py-1"
                    />
                  </motion.div>
                )}

                <div className="h-px bg-white/5 w-full my-2 rounded-full" />

                <div className="flex items-center justify-between">
                  <Label className="text-white/90">Theme</Label>
                  <button
                    onClick={() => setIsThemeModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-white/10 hover:bg-white/20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
                  >
                    <Palette className="w-3.5 h-3.5 text-white/70" />
                    <span>
                      {themes.find((t) => t.id === config.theme)?.name ||
                        "Auto"}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4 pb-8 px-8 pt-6">
          <Button
            onClick={handleStart}
            className="w-full text-lg h-14 rounded-2xl bg-white text-black hover:bg-white/90 hover:scale-[1.02] shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all duration-200 active:scale-95 font-medium"
          >
            <Play className="w-6 h-6 fill-current" />
          </Button>
          <div className="text-xs text-white/30 font-light text-center tracking-wide">
            Made by Khoi Tran
          </div>
        </CardFooter>
      </Card>

      <ThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={config.theme}
        onSelectTheme={(themeId) => {
          setConfig({ ...config, theme: themeId });
          onThemeChange?.(themeId);
        }}
      />
    </motion.div>
  );
}
