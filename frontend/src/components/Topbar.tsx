import React from 'react';
import { Search, Plus, Calendar, Menu, ShieldCheck, User } from 'lucide-react';
import { UserRole } from '../types';

interface TopbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  queueCount: number;
  userRole?: UserRole;
  onOpenNewPatientModal: () => void;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  searchQuery,
  setSearchQuery,
  queueCount,
  userRole = 'doctor',
  onOpenNewPatientModal,
  onOpenAuthModal,
  onLogout,
  onToggleMobileSidebar
}) => {
  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const isDoctor = userRole === 'doctor';
  const isAdmin = userRole === 'admin';
  const isPatient = userRole === 'patient';

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-[#DCE6E2] px-4 md:px-8 py-3.5 flex items-center justify-between gap-4 shadow-xs">
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 text-[#4E6259] hover:text-[#142420] rounded-xl border border-[#DCE6E2]"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        {/* Search Bar (Visible ONLY to Doctors) */}
        {isDoctor ? (
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7C8F87]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patient by name or phone (+92...)"
              className="w-full pl-9 pr-3 py-2 bg-[#F4F7F6] border border-[#DCE6E2] rounded-xl text-sm text-[#142420] placeholder-[#7C8F87] focus:outline-none focus:border-[#0F5C56] focus:bg-white transition-all font-medium"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#0F5C56]/10 text-[#0F5C56] flex items-center justify-center font-bold text-xs">
              CB
            </div>
            <span className="font-serif-display font-bold text-lg text-[#142420]">ClinicBell</span>
          </div>
        )}
      </div>

      <div className="hidden lg:flex items-center gap-2 text-xs text-[#4E6259]">
        <Calendar className="w-4 h-4 text-[#0F5C56]" />
        <span>{currentDateFormatted}</span>
        {isDoctor && (
          <>
            <span className="text-[#DCE6E2]">·</span>
            <strong className="text-[#142420] font-semibold">{queueCount} patients</strong> in queue
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
          isAdmin ? 'bg-[#25D366]/20 text-[#1DA851]' : isPatient ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
        }`}>
          {userRole}
        </span>

        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs md:text-sm py-2 px-3 rounded-xl transition-all border border-red-200 cursor-pointer"
          >
            <span>Log Out</span>
          </button>
        )}

        {/* New Patient Button (Visible ONLY to Doctors) */}
        {isDoctor && (
          <button
            onClick={onOpenNewPatientModal}
            className="flex items-center gap-1.5 bg-[#0F5C56] hover:bg-[#0A413D] text-white font-semibold text-xs md:text-sm py-2 px-3.5 rounded-xl transition-all shadow-xs active:scale-[0.98] shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.2]" />
            <span>New Patient</span>
          </button>
        )}
      </div>
    </header>
  );
};
