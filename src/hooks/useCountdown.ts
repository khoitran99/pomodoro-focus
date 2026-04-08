import { useEffect, useState } from "react";

interface UseCountdownOptions {
  endsAt: number | null;
  fallbackSeconds: number;
  isActive: boolean;
}

export function getSecondsRemaining(endsAt: number, now = Date.now()) {
  return Math.max(0, Math.ceil((endsAt - now) / 1000));
}

export function useCountdown({
  endsAt,
  fallbackSeconds,
  isActive,
}: UseCountdownOptions) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setNow(Date.now());

    if (!isActive || !endsAt) {
      return;
    }

    const tick = () => {
      setNow(Date.now());
    };

    const intervalId = window.setInterval(tick, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [endsAt, isActive]);

  if (!isActive || !endsAt) {
    return fallbackSeconds;
  }

  return getSecondsRemaining(endsAt, now);
}
