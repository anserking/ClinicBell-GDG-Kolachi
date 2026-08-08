import React, { useState, useEffect } from 'react';
import { WifiOff, Check } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => {
      setIsOffline(false);
      setShowRestored(true);
      setTimeout(() => setShowRestored(false), 3000);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (showRestored) {
    return (
      <div className="bg-[#E9FAF0] text-[#1DA851] border-b border-[#C7EDD5] px-4 py-2 text-xs font-semibold text-center flex items-center justify-center gap-1.5 animate-fadeIn">
        <Check className="w-3.5 h-3.5" />
        <span>Internet connection restored. Back online.</span>
      </div>
    );
  }

  if (!isOffline) return null;

  return (
    <div className="bg-[#FBF1DE] text-[#C98A2C] border-b border-[#F5E2BE] px-4 py-2 text-xs font-semibold text-center flex items-center justify-center gap-1.5 animate-fadeIn">
      <WifiOff className="w-3.5 h-3.5" />
      <span>You are currently offline. Changes are saved locally and synced when online.</span>
    </div>
  );
};
