import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import { ThemeModal } from "./ThemeModal";
import { themes } from "@/lib/themes";
import type { PomodoroConfig } from "@/hooks/usePomodoro";

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
      <Card className="bg-black/60 dark:bg-black/80 border-white/20 dark:border-white/10 shadow-2xl text-white">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold">
            Focus Session
          </CardTitle>
          <CardDescription className="text-center text-white/70">
            Configure your pomodoro parameters.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Deep Work Time</Label>
              <span className="text-sm font-medium">
                {config.workDuration} min
              </span>
            </div>
            <Slider
              value={[config.workDuration]}
              onValueChange={([val]) =>
                setConfig({ ...config, workDuration: val })
              }
              max={120}
              min={5}
              step={5}
              className="py-2"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Rest Time</Label>
              <span className="text-sm font-medium">
                {config.restDuration} min
              </span>
            </div>
            <Slider
              value={[config.restDuration]}
              onValueChange={([val]) =>
                setConfig({ ...config, restDuration: val })
              }
              max={45}
              min={1}
              step={1}
              className="py-2"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="infinite-mode" className="flex flex-col gap-1">
                <span>Infinite Mode</span>
                <span className="font-normal text-xs text-white/70">
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
                <div className="flex justify-between">
                  <Label>Iterations</Label>
                  <span className="text-sm font-medium">
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
                />
              </motion.div>
            )}
          </div>

          <div className="space-y-3">
            <Label>Theme</Label>
            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="flex items-center justify-between w-full h-10 px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-md text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-white/70" />
                <span>
                  {themes.find((t) => t.id === config.theme)?.name || "Theme"}
                </span>
              </div>
              <span className="text-xs text-white/50">Change</span>
            </button>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button
            onClick={handleStart}
            className="w-full text-lg h-12 bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all active:scale-95"
          >
            Start Focus
          </Button>
          <div className="text-xs text-white/50 font-light text-center">
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
