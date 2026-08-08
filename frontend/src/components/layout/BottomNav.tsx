import React from 'react';
import { ActiveView } from '../../types';
import { CalendarDays, Users, MessageSquare, Settings } from 'lucide-react';

interface BottomNavProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  queueCount: number;
  patientsCount: number;
  followupsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeView,
  setActiveView,
  queueCount,
  patientsCount,
  followupsCount
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0A413D] text-[#EAF3F1] border-t border-[#145751] px-2 py-1.5 flex items-center justify-around shadow-lg">
      <button
        onClick={() => setActiveView('today')}
        className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all relative ${
          activeView === 'today' ? 'text-white font-bold' : 'text-[#9FC0BA] hover:text-white'
        }`}
      >
        <div className="relative">
          <CalendarDays className="w-5 h-5" />
          {queueCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-[#25D366] text-[#06331A] text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono-tabular">
              {queueCount}
            </span>
          )}
        </div>
        <span className="text-[11px] mt-1">Queue</span>
        {activeView === 'today' && (
          <span className="w-4 h-0.5 bg-[#25D366] rounded-full mt-0.5 animate-fadeIn" />
        )}
      </button>

      <button
        onClick={() => setActiveView('patients')}
        className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all relative ${
          activeView === 'patients' ? 'text-white font-bold' : 'text-[#9FC0BA] hover:text-white'
        }`}
      >
        <div className="relative">
          <Users className="w-5 h-5" />
          <span className="absolute -top-1 -right-2 bg-white/20 text-white text-[10px] font-medium px-1.5 py-0.2 rounded-full font-mono-tabular">
            {patientsCount}
          </span>
        </div>
        <span className="text-[11px] mt-1">Patients</span>
        {activeView === 'patients' && (
          <span className="w-4 h-0.5 bg-[#25D366] rounded-full mt-0.5 animate-fadeIn" />
        )}
      </button>

      <button
        onClick={() => setActiveView('followups')}
        className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all relative ${
          activeView === 'followups' ? 'text-white font-bold' : 'text-[#9FC0BA] hover:text-white'
        }`}
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5" />
          <span className="absolute -top-1 -right-2 bg-white/20 text-white text-[10px] font-medium px-1.5 py-0.2 rounded-full font-mono-tabular">
            {followupsCount}
          </span>
        </div>
        <span className="text-[11px] mt-1">Follow-ups</span>
        {activeView === 'followups' && (
          <span className="w-4 h-0.5 bg-[#25D366] rounded-full mt-0.5 animate-fadeIn" />
        )}
      </button>

      <button
        onClick={() => setActiveView('settings')}
        className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all relative ${
          activeView === 'settings' ? 'text-white font-bold' : 'text-[#9FC0BA] hover:text-white'
        }`}
      >
        <Settings className="w-5 h-5" />
        <span className="text-[11px] mt-1">Settings</span>
        {activeView === 'settings' && (
          <span className="w-4 h-0.5 bg-[#25D366] rounded-full mt-0.5 animate-fadeIn" />
        )}
      </button>
    </nav>
  );
};
