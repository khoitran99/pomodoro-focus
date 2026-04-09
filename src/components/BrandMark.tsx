import { cn } from "@/lib/utils";

interface BrandMarkProps {
  className?: string;
  size?: "default" | "compact";
}

export function BrandMark({
  className,
  size = "default",
}: BrandMarkProps) {
  const isCompact = size === "compact";

  return (
    <div
      className={cn(
        "flex items-center gap-3 text-white",
        isCompact && "gap-2.5",
        className,
      )}
    >
      <div
        className={cn(
          "relative flex items-center justify-center rounded-[1.4rem] border border-white/12 bg-linear-to-br from-[#ff9a74]/35 via-white/10 to-[#ff6b57]/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_16px_40px_rgba(0,0,0,0.18)]",
          isCompact ? "h-11 w-11 rounded-[1.1rem]" : "h-14 w-14",
        )}
      >
        <span
          className={cn(
            "absolute rounded-full bg-[#b9f18f] shadow-[0_0_14px_rgba(185,241,143,0.3)]",
            isCompact
              ? "left-1/2 top-2 h-1.5 w-4 -translate-x-1/2"
              : "left-1/2 top-2.5 h-2 w-5 -translate-x-1/2",
          )}
        />
        <span
          className={cn(
            "absolute rounded-full bg-[#c8f4a8]",
            isCompact
              ? "left-1/2 top-1 h-2.5 w-2.5 -translate-x-[0.05rem] rotate-[18deg]"
              : "left-1/2 top-1.5 h-3 w-3 -translate-x-[0.1rem] rotate-[18deg]",
          )}
        />
        <span
          className={cn(
            "relative rounded-full border border-white/35 bg-white/12",
            isCompact ? "h-6 w-6" : "h-8 w-8",
          )}
        >
          <span className="absolute left-1/2 top-[23%] h-[32%] w-[2px] -translate-x-1/2 rounded-full bg-white/92" />
          <span className="absolute left-1/2 top-1/2 h-[2px] w-[30%] -translate-y-1/2 rounded-full bg-white/92" />
        </span>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-end gap-x-2 gap-y-0.5 leading-none">
          <span
            className={cn(
              "tracking-[-0.045em]",
              isCompact ? "text-xl font-semibold" : "text-[1.75rem] font-semibold",
            )}
          >
            Pomodoro
          </span>
          <span
            className={cn(
              "font-medium tracking-[0.18em] uppercase text-white/54",
              isCompact ? "pb-0.5 text-[0.62rem]" : "pb-1 text-[0.66rem]",
            )}
          >
            by KT
          </span>
        </div>
        {!isCompact && (
          <p className="mt-1 text-sm text-white/48">
            A calmer focus ritual.
          </p>
        )}
      </div>
    </div>
  );
}
