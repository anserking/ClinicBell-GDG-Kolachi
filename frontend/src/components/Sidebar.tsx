import React from 'react';
import { ActiveView } from '../types';
import {
  CalendarDays,
  Users,
  MessageSquare,
  Settings,
  Plus,
  Stethoscope,
  Activity,
  ShieldCheck,
  FileText
} from 'lucide-react';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  queueCount: number;
  patientsCount: number;
  followupsCount: number;
  onOpenNewPatientModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  queueCount,
  patientsCount,
  followupsCount,
  onOpenNewPatientModal
}) => {
  return (
    <aside className="bg-[#0A413D] text-[#EAF3F1] p-6 flex flex-col justify-between h-full min-h-screen border-r border-[#145751] select-none">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#25D366] to-[#0f7a3c] flex items-center justify-center text-white shadow-md shadow-[#00000020] shrink-0">
            <Stethoscope className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="font-serif-display text-lg font-bold text-white leading-tight tracking-tight">
              ClinicBell
            </div>
            <div className="text-[11px] text-[#9FC0BA] font-mono-tabular tracking-wide">
              Al-Noor Clinic · Karachi
            </div>
          </div>
        </div>

        {/* Quick Add Patient Button */}
        <button
          onClick={onOpenNewPatientModal}
          className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-[#06331A] font-semibold text-sm py-2.5 px-3 rounded-xl transition-all shadow-sm active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Patient</span>
        </button>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 pt-1">
          <button
            onClick={() => setActiveView('today')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeView === 'today'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-[#C9DEDA] hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CalendarDays className="w-4.5 h-4.5 opacity-90" />
              <span>Today's Queue</span>
            </div>
            <span
              className={`text-[11px] font-mono-tabular px-2 py-0.5 rounded-full ${
                activeView === 'today'
                  ? 'bg-[#25D366] text-[#06331A] font-semibold'
                  : 'bg-white/10 text-[#C9DEDA]'
              }`}
            >
              {queueCount}
            </span>
          </button>

          <button
            onClick={() => setActiveView('patients')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeView === 'patients'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-[#C9DEDA] hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4.5 h-4.5 opacity-90" />
              <span>All Patients</span>
            </div>
            <span className="text-[11px] font-mono-tabular px-2 py-0.5 rounded-full bg-white/10 text-[#C9DEDA]">
              {patientsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveView('followups')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeView === 'followups'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-[#C9DEDA] hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4.5 h-4.5 opacity-90" />
              <span>Follow-ups</span>
            </div>
            <span className="text-[11px] font-mono-tabular px-2 py-0.5 rounded-full bg-white/10 text-[#C9DEDA]">
              {followupsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveView('settings')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeView === 'settings'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-[#C9DEDA] hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4.5 h-4.5 opacity-90" />
              <span>Settings</span>
            </div>
          </button>

          <div className="pt-2 mt-2 border-t border-white/10 text-[11px] font-semibold text-[#9FC0BA] uppercase tracking-wider px-3">
            Portals &amp; Auth
          </div>

          <button
            onClick={() => setActiveView('admin')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeView === 'admin'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-[#C9DEDA] hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4.5 h-4.5 opacity-90 text-[#25D366]" />
              <span>Admin Panel</span>
            </div>
            <span className="text-[10px] font-mono-tabular px-2 py-0.5 rounded-md bg-[#25D366]/20 text-[#25D366]">
              Admin
            </span>
          </button>

          <button
            onClick={() => setActiveView('patient-portal')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeView === 'patient-portal'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-[#C9DEDA] hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4.5 h-4.5 opacity-90 text-[#9FC0BA]" />
              <span>Customer Portal</span>
            </div>
            <span className="text-[10px] font-mono-tabular px-2 py-0.5 rounded-md bg-white/10 text-[#C9DEDA]">
              Customer
            </span>
          </button>
        </nav>
      </div>

      {/* Doctor Profile Footer */}
      <div className="pt-4 border-t border-white/10 flex items-center gap-3 px-1">
        <div className="w-9 h-9 rounded-full bg-[#C9DEDA] text-[#0A413D] flex items-center justify-center font-serif-display font-bold text-sm shrink-0">
          DA
        </div>
        <div className="overflow-hidden">
          <div className="text-xs font-semibold text-white truncate">
            Dr. Ahmed Raza
          </div>
          <div className="text-[11px] text-[#9FC0BA] truncate">
            General Physician
          </div>
        </div>
      </div>
    </aside>
  );
};
