import React from 'react';
import { ActiveView, UserRole, User } from '../types';
import {
  CalendarDays,
  Users,
  MessageSquare,
  Settings,
  Plus,
  Stethoscope,
  ShieldCheck,
  FileText,
  UserCheck
} from 'lucide-react';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  queueCount: number;
  patientsCount: number;
  followupsCount: number;
  userRole?: UserRole;
  currentUser?: User | null;
  onOpenNewPatientModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  queueCount,
  patientsCount,
  followupsCount,
  userRole = 'doctor',
  currentUser,
  onOpenNewPatientModal
}) => {
  const isDoctor = userRole === 'doctor';
  const isAdmin = userRole === 'admin';
  const isPatient = userRole === 'patient';

  if (isPatient) {
    // Customers see dedicated Customer Portal layout without Doctor/Admin sidebar
    return null;
  }

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
              {currentUser?.hospitalName || 'GDGDemo Hospital Node'}
            </div>
          </div>
        </div>

        {/* Quick Add Patient Button (Visible ONLY to Doctors) */}
        {isDoctor && (
          <button
            onClick={onOpenNewPatientModal}
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-[#06331A] font-semibold text-sm py-2.5 px-3 rounded-xl transition-all shadow-sm active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Patient</span>
          </button>
        )}

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 pt-1">
          {/* DOCTOR-ONLY NAV ITEMS */}
          {isDoctor && (
            <>
              <button
                onClick={() => setActiveView('today')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
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
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
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
            </>
          )}

          {/* ADMIN-ONLY NAV ITEMS */}
          {isAdmin && (
            <button
              onClick={() => setActiveView('admin')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeView === 'admin'
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-[#C9DEDA] hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4.5 h-4.5 text-[#25D366]" />
                <span>Admin Panel</span>
              </div>
              <span className="text-[10px] font-mono-tabular px-2 py-0.5 rounded-md bg-[#25D366]/20 text-[#25D366] font-bold">
                Admin
              </span>
            </button>
          )}

          {/* SHARED DOCTOR & ADMIN NAV ITEMS */}
          {(isDoctor || isAdmin) && (
            <>
              <button
                onClick={() => setActiveView('followups')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
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
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
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
            </>
          )}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="pt-4 border-t border-white/10 flex items-center gap-3 px-1">
        <div className="w-9 h-9 rounded-full bg-[#C9DEDA] text-[#0A413D] flex items-center justify-center font-serif-display font-bold text-sm shrink-0">
          {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'CB'}
        </div>
        <div className="overflow-hidden">
          <div className="text-xs font-semibold text-white truncate">
            {currentUser?.name || (isAdmin ? 'Administrator' : 'Dr. Ahmed Raza')}
          </div>
          <div className="text-[11px] text-[#9FC0BA] truncate font-mono-tabular">
            {currentUser?.specialty || (isAdmin ? 'System Admin' : 'General Medicine')}
          </div>
        </div>
      </div>
    </aside>
  );
};
