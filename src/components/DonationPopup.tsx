import { Coffee } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DonationPopup() {
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center gap-2 px-4 py-2 hover:bg-white/10 transition-colors shadow-2xl"
          >
            <Coffee className="w-5 h-5 text-yellow-500" />
            <span className="font-light text-sm hidden sm:inline-block">
              Buy me a coffee
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[95vw] sm:max-w-xl bg-neutral-900 border-white/10 text-white rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-center sm:text-center space-y-3">
            <DialogTitle className="text-2xl font-light">
              Support KT Focus
            </DialogTitle>
            <DialogDescription className="text-white/70">
              If you enjoy using this app and it helps you stay productive,
              consider buying me a coffee to support future development!
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-6 pt-4">
            <div className="relative w-full max-w-sm aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center shadow-lg mx-auto">
              <img
                src="/donation.jpg"
                alt="Donation QR Code"
                className="w-full h-full object-cover scale-[1.35] -translate-y-[4%]"
              />
            </div>

            <div className="flex flex-col items-center justify-center space-y-2 text-center w-full px-4 pb-4">
              <div className="h-px w-1/2 bg-white/10 my-2"></div>
              <p className="text-sm font-medium text-white/90">TRAN VAN KHOI</p>
              <div className="bg-white/5 border border-white/10 rounded-md px-4 py-2 mt-1">
                <p className="text-lg font-mono text-yellow-500 tracking-wider">
                  0285 3220 901
                </p>
              </div>
              <p className="text-xs text-white/50 pt-2 uppercase tracking-wide">
                TPBank
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
