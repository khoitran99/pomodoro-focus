import { useEffect, useState } from "react";
import {
  getClientPerformanceSignals,
  resolvePerformanceMode,
  type EffectivePerformanceMode,
  type PerformanceMode,
} from "@/lib/performance";

export function useEffectivePerformanceMode(
  performanceMode: PerformanceMode,
): EffectivePerformanceMode {
  const [signals, setSignals] = useState(getClientPerformanceSignals);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => {
      setSignals(getClientPerformanceSignals());
    };

    handleChange();

    if (motionQuery.addEventListener) {
      motionQuery.addEventListener("change", handleChange);
      return () => motionQuery.removeEventListener("change", handleChange);
    }

    motionQuery.addListener(handleChange);
    return () => motionQuery.removeListener(handleChange);
  }, []);

  return resolvePerformanceMode(performanceMode, signals);
}
