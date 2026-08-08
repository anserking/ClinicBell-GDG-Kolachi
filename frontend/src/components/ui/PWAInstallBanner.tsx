import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Smartphone, Download, X } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const { canInstall, triggerInstall } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  if (!canInstall || dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-[#0A413D] to-[#0F5C56] text-white px-4 py-3 shadow-md flex items-center justify-between gap-3 text-xs sm:text-sm animate-slideDown">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
          <Smartphone className="w-4 h-4 text-[#25D366]" />
        </div>
        <div>
          <span className="font-semibold block sm:inline">Install Sehat Loop App</span>
          <span className="text-[#9FC0BA] sm:ml-2 text-[11px] sm:text-xs">
            Add to Home Screen for fast offline clinical access
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={triggerInstall}
          className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1DA851] text-[#06331A] font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-xs active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install</span>
        </button>

        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-[#9FC0BA] hover:text-white rounded-md transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
