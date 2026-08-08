import React from 'react';
import { Patient } from '../types';
import {
  FileText,
  Calendar,
  Stethoscope,
  Phone,
  ShieldCheck,
  Building2,
  CheckCircle,
  MessageSquare,
  Clock,
  Sparkles,
  Pill
} from 'lucide-react';

interface PatientPortalViewProps {
  patient: Patient | null;
  hospitalName?: string;
}

export const PatientPortalView: React.FC<PatientPortalViewProps> = ({
  patient,
  hospitalName = 'GDGDemo Hospital — Al-Noor Clinic'
}) => {
  if (!patient) {
    return (
      <div className="bg-white border border-[#DCE6E2] rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
        <div className="w-12 h-12 bg-[#0F5C56]/10 text-[#0F5C56] rounded-full flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[#142420]">Patient Record Not Found</h2>
        <p className="text-xs text-[#7C8F87]">
          Please log in with your registered CNIC and password to view your medical history timeline.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl animate-fadeIn">
      {/* Portal Header */}
      <div className="bg-gradient-to-r from-[#0A413D] to-[#0F5C56] text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="bg-white/10 text-[#9FC0BA] px-3 py-1 rounded-full text-xs font-mono-tabular flex items-center gap-1.5 backdrop-blur-xs">
              <Building2 className="w-3.5 h-3.5" /> {hospitalName}
            </span>
            <span className="bg-[#25D366]/20 text-[#25D366] px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> End-to-End Encrypted Patient Portal
            </span>
          </div>

          <div>
            <h1 className="font-serif-display text-2xl sm:text-3xl font-bold tracking-tight">
              {patient.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#9FC0BA] font-mono-tabular mt-1">
              <span>Age: {patient.age || 32} yrs</span>
              <span>·</span>
              <span>Gender: {patient.gender || 'Male'}</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-[#25D366]">
                <Phone className="w-3.5 h-3.5" /> {patient.phone}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Medical History Timeline */}
        <div className="md:col-span-8 border border-[#DCE6E2] rounded-2xl p-6 bg-white shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#DCE6E2] pb-4">
            <h2 className="text-base font-bold text-[#142420] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#0F5C56]" />
              <span>Medical History &amp; Clinical Visits</span>
            </h2>
            <span className="text-xs text-[#7C8F87] font-mono-tabular bg-[#F4F7F6] px-2.5 py-1 rounded-lg">
              {patient.visitsCount || patient.history.length} Total Visits
            </span>
          </div>

          <div className="space-y-6 relative pl-2">
            {patient.history.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#7C8F87]">
                No clinical visits recorded yet.
              </div>
            ) : (
              patient.history.map((visit, idx) => (
                <div key={visit.id || idx} className="relative pl-6 border-l-2 border-[#E5F0EE] space-y-2">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#0F5C56] ring-4 ring-white" />

                  <div className="flex items-center justify-between text-xs text-[#7C8F87] font-mono-tabular">
                    <span className="font-semibold text-[#0F5C56] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {visit.date}
                    </span>
                    <span>{visit.doctorName || 'Dr. Ahmed Raza'}</span>
                  </div>

                  <div className="bg-[#F4F7F6]/60 border border-[#DCE6E2] p-4 rounded-xl space-y-2.5">
                    {visit.diagnosis && (
                      <div>
                        <span className="text-[11px] font-bold text-[#7C8F87] uppercase tracking-wider block">
                          Diagnosis / Clinical Condition
                        </span>
                        <div className="text-xs sm:text-sm font-semibold text-[#142420]">
                          {visit.diagnosis}
                        </div>
                      </div>
                    )}

                    {visit.prescription && (
                      <div>
                        <span className="text-[11px] font-bold text-[#7C8F87] uppercase tracking-wider flex items-center gap-1">
                          <Pill className="w-3 h-3 text-[#0F5C56]" /> Prescribed Medications &amp; Care
                        </span>
                        <div className="text-xs sm:text-sm text-[#142420] mt-0.5 bg-white p-2.5 rounded-lg border border-[#DCE6E2] font-mono-tabular">
                          {visit.prescription}
                        </div>
                      </div>
                    )}

                    {!visit.diagnosis && !visit.prescription && (
                      <div className="text-xs sm:text-sm text-[#142420]">{visit.text}</div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Automated Follow-up Reminder & Hospital Contact */}
        <div className="md:col-span-4 space-y-4">
          <div className="border border-[#DCE6E2] rounded-2xl p-5 bg-white shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-[#142420] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#0F5C56]" />
              <span>Automated WhatsApp Check-in</span>
            </h3>

            <div className="bg-[#E5F0EE]/60 border border-[#B1D8D2] p-3 rounded-xl text-xs space-y-1.5">
              <div className="text-[#0A413D] font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#0F5C56]" />
                <span>Next Follow-up Status</span>
              </div>
              <div className="text-[11px] text-[#4E6259]">
                {patient.followupEnabled
                  ? `Scheduled (${patient.followupDelay || '2 weeks'})`
                  : 'Follow-up Check-in Completed'}
              </div>
            </div>

            {patient.followupMessage && (
              <div className="text-xs text-[#142420] bg-[#F4F7F6] p-3 rounded-xl border border-[#DCE6E2] font-mono-tabular leading-relaxed">
                "{patient.followupMessage}"
              </div>
            )}
          </div>

          <div className="border border-[#DCE6E2] rounded-2xl p-5 bg-white shadow-2xs space-y-2 text-xs">
            <h3 className="font-bold text-[#142420] flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-[#0F5C56]" />
              <span>Attending Physician</span>
            </h3>
            <p className="text-[#4E6259]">Dr. Ahmed Raza · Senior Consultant</p>
            <p className="text-[#7C8F87] font-mono-tabular">Al-Noor Clinic · Karachi</p>
          </div>
        </div>
      </div>
    </div>
  );
};
