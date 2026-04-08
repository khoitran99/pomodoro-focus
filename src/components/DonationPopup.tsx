import { useState } from "react";
import { Coffee, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { EffectivePerformanceMode } from "@/lib/performance";

interface DonationPopupProps {
  performanceMode: EffectivePerformanceMode;
}

export function DonationPopup({ performanceMode }: DonationPopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(true)}
        className={cn(
          "animate-screen-enter flex items-center gap-2 rounded-full border px-4 py-2 text-white transition-all duration-300 hover:-translate-y-0.5",
          performanceMode === "immersive"
            ? "border-white/10 bg-black/60 shadow-2xl hover:bg-white/20"
            : "border-white/12 bg-black/80 shadow-xl hover:bg-black/70",
        )}
      >
        <Coffee className="h-5 w-5 text-yellow-500" />
        <span className="hidden text-sm font-light sm:inline-block">
          Buy me a coffee
        </span>
      </Button>

      {isOpen && (
        <div
          className={cn(
            "animate-overlay-fade fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4",
            performanceMode === "immersive" && "backdrop-blur-sm",
          )}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="animate-modal-enter max-h-[90vh] w-[95vw] max-w-xl overflow-y-auto rounded-2xl border border-white/10 bg-neutral-900 text-white"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between p-6">
              <div className="space-y-3 text-center sm:text-center">
                <h2 className="text-2xl font-light">Support KT Focus</h2>
                <p className="text-white/70">
                  If you enjoy using this app and it helps you stay productive,
                  consider buying me a coffee to support future development.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center space-y-6 px-6 pb-6 pt-2">
              <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-lg">
                <img
                  src="/donation.jpg"
                  alt="Donation QR Code"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full translate-y-[14%] scale-[1.6] object-cover"
                />
              </div>

              <div className="flex w-full flex-col items-center justify-center space-y-2 px-4 pb-4 text-center">
                <div className="my-2 h-px w-1/2 bg-white/10" />
                <p className="text-sm font-medium text-white/90">
                  TRAN VAN KHOI
                </p>
                <div className="mt-1 rounded-md border border-white/10 bg-white/5 px-4 py-2">
                  <p className="font-mono text-lg tracking-wider text-yellow-500">
                    0285 3220 901
                  </p>
                </div>
                <p className="pt-2 text-xs uppercase tracking-wide text-white/50">
                  TPBank
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
