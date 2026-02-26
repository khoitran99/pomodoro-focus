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
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const THEMES = [
    { value: "midnight", label: "Midnight Calm" },
    { value: "forest", label: "Deep Forest" },
    { value: "ocean", label: "Ocean Breeze" },
    { value: "image-beach", label: "Serene Beach" },
    { value: "image-city", label: "City at Night" },
    { value: "image-coffee", label: "Cozy Cafe" },
    { value: "image-study", label: "Study Desk" },
    { value: "image-forest", label: "Misty Forest" },
    { value: "image-sky", label: "Clear Sky" },
    { value: "image-galaxy", label: "Deep Galaxy" },
    { value: "image-mars", label: "Red Mars" },
    { value: "image-blackhole", label: "Black Hole" },
  ];

  const ThemeSwatch = ({ theme }: { theme: string }) => {
    if (theme.startsWith("image-")) {
      const name = theme.replace("image-", "");
      return (
        <div
          className="w-5 h-5 rounded-sm mr-2 shrink-0 bg-cover bg-center border border-white/20"
          style={{ backgroundImage: `url('/themes/${name}.jpg')` }}
        />
      );
    }
    const colors: Record<string, string> = {
      midnight: "bg-neutral-900",
      forest: "bg-emerald-900",
      ocean: "bg-blue-900",
    };
    return (
      <div
        className={`w-5 h-5 rounded-sm mr-2 shrink-0 border border-white/20 ${colors[theme] || "bg-black"}`}
      />
    );
  };

  const [config, setConfig] = useState<PomodoroConfig>(initialConfig);
  const [isInfinite, setIsInfinite] = useState(initialConfig.iterations === 0);

  const handleStart = () => {
    onStart({
      ...config,
      iterations: isInfinite ? 0 : config.iterations,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setConfig({ ...config, customBackground: url });
      onThemeChange?.("custom");
    }
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
            <Select
              value={config.theme}
              onValueChange={(val) => {
                setConfig({ ...config, theme: val });
                onThemeChange?.(val);
              }}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white [&_svg]:text-white data-placeholder:text-white/70">
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {THEMES.map((theme) => (
                  <SelectItem key={theme.value} value={theme.value}>
                    <div className="flex items-center">
                      <ThemeSwatch theme={theme.value} />
                      {theme.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {config.customBackground && (
              <div className="mt-2 flex items-center justify-between bg-white/5 border border-white/10 p-2 rounded-md">
                <div className="flex items-center text-sm truncate">
                  <div
                    className="w-5 h-5 rounded-sm mr-2 shrink-0 bg-cover bg-center border border-white/20"
                    style={{
                      backgroundImage: `url('${config.customBackground}')`,
                    }}
                  />
                  <span>Custom Image</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-white/50 hover:text-white hover:bg-white/10"
                  onClick={() => setConfig({ ...config, customBackground: "" })}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {!config.customBackground && (
              <div className="mt-2">
                <Label
                  htmlFor="file-upload"
                  className="flex items-center justify-center w-full max-w-xs mx-auto px-4 py-2 border border-dashed border-white/20 text-white/70 hover:text-white hover:border-white/40 hover:bg-white/5 rounded-md cursor-pointer transition-colors text-xs"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Custom Background
                </Label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            )}
          </div>

          <div className="space-y-3 pt-2 border-t border-white/10">
            <div className="flex flex-col gap-1">
              <Label>Custom Audio (Optional)</Label>
              <span className="text-xs text-white/50">
                Paste a YouTube URL to replace default music.
              </span>
            </div>
            <Input
              placeholder="https://www.youtube.com/watch?v=..."
              value={config.youtubeUrl || ""}
              onChange={(e) =>
                setConfig({ ...config, youtubeUrl: e.target.value })
              }
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-10"
            />
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
    </motion.div>
  );
}
