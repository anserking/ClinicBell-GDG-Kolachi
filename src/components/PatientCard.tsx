import React from 'react';
import { Patient } from '../types';
import { MessageCircle, Clock, CheckCircle2, ChevronRight, User } from 'lucide-react';

interface PatientCardProps {
  patient: Patient;
  onSelect: (patient: Patient) => void;
  onQuickWhatsApp: (patient: Patient, e: React.MouseEvent) => void;
  onToggleStatus?: (patient: Patient, e: React.MouseEvent) => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  onSelect,
  onQuickWhatsApp,
  onToggleStatus
}) => {
  const getStatusBadge = () => {
    switch (patient.status) {
      case 'new':
        return (
          <span className="text-[10.5px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E5F0EE] text-[#0A413D]">
            New visit
          </span>
        );
      case 'due':
        return (
          <span className="text-[10.5px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FBF1DE] text-[#C98A2C]">
            Follow-up due
          </span>
        );
      case 'sent':
        return (
          <span className="text-[10.5px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E9FAF0] text-[#1DA851]">
            WhatsApp Sent
          </span>
        );
      case 'completed':
        return (
          <span className="text-[10.5px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      onClick={() => onSelect(patient)}
      className="group bg-white border border-[#DCE6E2] border-t-0 rounded-b-2xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between hover:-translate-y-0.5"
    >
      {/* Torn prescription slip paper motif top */}
      <div className="tear-edge w-full shrink-0"></div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-bold text-[#142420] group-hover:text-[#0F5C56] transition-colors leading-tight">
                {patient.name}
              </h3>
              {patient.age && (
                <span className="text-xs text-[#7C8F87] font-normal">
                  ({patient.age}{patient.gender ? `, ${patient.gender[0]}` : ''})
                </span>
              )}
            </div>
            <div className="text-xs text-[#7C8F87] font-mono-tabular mt-0.5">
              {patient.phone}
            </div>
          </div>
          {getStatusBadge()}
        </div>

        {/* Note Body */}
        <p className="text-xs sm:text-sm text-[#4E6259] leading-relaxed line-clamp-2">
          {patient.note}
        </p>

        {/* Card Footer info & quick actions */}
        <div className="pt-2 border-t border-[#F0F5F3] flex items-center justify-between text-xs text-[#7C8F87] font-mono-tabular">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-[#0F5C56]" />
              {patient.visitsCount} visit{patient.visitsCount > 1 ? 's' : ''}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-[#4E6259]">
              <Clock className="w-3.5 h-3.5" />
              {patient.lastVisit}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => onQuickWhatsApp(patient, e)}
              className="p-1.5 rounded-lg bg-[#E9FAF0] hover:bg-[#25D366] text-[#1DA851] hover:text-white transition-colors"
              title="Quick WhatsApp Check-in"
            >
              <MessageSquareIcon className="w-3.5 h-3.5" />
            </button>
            <div className="text-[#0F5C56] group-hover:translate-x-0.5 transition-transform">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MessageSquareIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4 8.5 8.5 0 0 1-4-1L3 20l1.2-4.9a8.4 8.4 0 0 1-1-4A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z" />
  </svg>
);
