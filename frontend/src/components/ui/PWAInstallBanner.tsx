import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Smartphone, Download, X } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const { isInstalled, isIOS, triggerInstall } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  if (isInstalled || dismissed) return null;

  const handleInstallClick = async () => {
    const res = await triggerInstall();
    if (res === 'manual_instructions') {
      setShowInstructions(true);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-[#0A413D] to-[#0F5C56] text-white px-4 py-3 shadow-md flex items-center justify-between gap-3 text-xs sm:text-sm animate-slideDown relative z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <Smartphone className="w-4 h-4 text-[#25D366]" />
          </div>
          <div>
            <span className="font-semibold block sm:inline">Install ClinicBell App</span>
            <span className="text-[#9FC0BA] sm:ml-2 text-[11px] sm:text-xs">
              Add to Home Screen for fast offline clinical access
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1DA851] text-[#06331A] font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-[#9FC0BA] hover:text-white rounded-md transition-colors cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Manual Install Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white text-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowInstructions(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-[#0F5C56]/10 text-[#0F5C56] rounded-full flex items-center justify-center mx-auto mb-3">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Install ClinicBell</h3>
              <p className="text-xs text-slate-500 mt-1">
                Follow these simple steps to add the app to your home screen:
              </p>
            </div>

            {isIOS ? (
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl text-xs text-slate-700">
                <div className="flex items-start gap-2.5">
                  <span className="font-bold bg-[#0F5C56] text-white w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px]">1</span>
                  <p>Tap the <strong>Share</strong> icon in Safari (bottom navigation bar).</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="font-bold bg-[#0F5C56] text-white w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px]">2</span>
                  <p>Scroll down and select <strong>"Add to Home Screen"</strong> (+ icon).</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="font-bold bg-[#0F5C56] text-white w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px]">3</span>
                  <p>Tap <strong>Add</strong> in top right corner.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl text-xs text-slate-700">
                <div className="flex items-start gap-2.5">
                  <span className="font-bold bg-[#0F5C56] text-white w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px]">1</span>
                  <p>Tap the <strong>⋮ (3 dots)</strong> menu in the top right of Chrome.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="font-bold bg-[#0F5C56] text-white w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px]">2</span>
                  <p>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="font-bold bg-[#0F5C56] text-white w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px]">3</span>
                  <p>Confirm by clicking <strong>Install</strong>.</p>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowInstructions(false)}
              className="w-full mt-5 bg-[#0F5C56] hover:bg-[#0A413D] text-white font-semibold py-2.5 rounded-xl text-xs transition-colors shadow-xs"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
