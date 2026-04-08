export type PerformanceMode = "auto" | "balanced" | "immersive";
export type EffectivePerformanceMode = Exclude<PerformanceMode, "auto">;

export interface PerformanceSignals {
  deviceMemory?: number;
  hardwareConcurrency?: number;
  prefersReducedMotion: boolean;
  saveData: boolean;
}

interface NavigatorWithConnection extends Navigator {
  connection?: {
    saveData?: boolean;
  };
  deviceMemory?: number;
}

export function isPerformanceMode(value: unknown): value is PerformanceMode {
  return value === "auto" || value === "balanced" || value === "immersive";
}

export function isLowPowerClient(signals: PerformanceSignals) {
  return (
    signals.prefersReducedMotion ||
    signals.saveData ||
    (typeof signals.deviceMemory === "number" && signals.deviceMemory <= 4) ||
    (typeof signals.hardwareConcurrency === "number" &&
      signals.hardwareConcurrency <= 4)
  );
}

export function resolvePerformanceMode(
  preferredMode: PerformanceMode,
  signals: PerformanceSignals,
): EffectivePerformanceMode {
  if (preferredMode !== "auto") {
    return preferredMode;
  }

  return isLowPowerClient(signals) ? "balanced" : "immersive";
}

export function getClientPerformanceSignals(): PerformanceSignals {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {
      prefersReducedMotion: false,
      saveData: false,
    };
  }

  const clientNavigator = navigator as NavigatorWithConnection;

  return {
    deviceMemory: clientNavigator.deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency,
    prefersReducedMotion:
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    saveData: clientNavigator.connection?.saveData ?? false,
  };
}
