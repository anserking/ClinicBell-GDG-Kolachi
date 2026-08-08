import React from 'react';
import { Search, Plus, Calendar, Menu } from 'lucide-react';

interface TopbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  queueCount: number;
  onOpenNewPatientModal: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  searchQuery,
  setSearchQuery,
  queueCount,
  onOpenNewPatientModal,
  onToggleMobileSidebar
}) => {
  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-[#DCE6E2] px-4 md:px-8 py-3.5 flex items-center justify-between gap-4 shadow-xs">
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7C8F87]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient by name or phone (+92...)"
            className="w-full pl-9 pr-3 py-2 bg-[#F4F7F6] border border-[#DCE6E2] rounded-xl text-sm text-[#142420] placeholder-[#7C8F87] focus:outline-none focus:border-[#0F5C56] focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-2 text-xs text-[#4E6259]">
        <Calendar className="w-4 h-4 text-[#0F5C56]" />
        <span>{currentDateFormatted}</span>
        <span className="text-[#DCE6E2]">·</span>
        <strong className="text-[#142420] font-semibold">{queueCount} patients</strong> in queue
      </div>

      <button
        onClick={onOpenNewPatientModal}
        className="flex items-center gap-1.5 bg-[#0F5C56] hover:bg-[#0A413D] text-white font-semibold text-xs md:text-sm py-2 px-3.5 rounded-xl transition-all shadow-xs active:scale-[0.98] shrink-0"
      >
        <Plus className="w-4 h-4 stroke-[2.2]" />
        <span>New Patient</span>
      </button>
    </header>
  );
};
