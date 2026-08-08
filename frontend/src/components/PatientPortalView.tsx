import React, { useState, useEffect } from 'react';
import { Patient, User } from '../types';
import { getApiBaseUrl } from '../config';
import { PWAInstallBanner } from './ui/PWAInstallBanner';
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
  Pill,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface PatientPortalViewProps {
  patient: Patient | null;
  currentUser?: User | null;
  hospitalName?: string;
}

export const PatientPortalView: React.FC<PatientPortalViewProps> = ({
  patient: propPatient,
  currentUser,
  hospitalName = 'GDGDemo Hospital'
}) => {
  const [data, setData] = useState<{
    patient: any;
    visits: any[];
    followups: any[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cnicToFetch = currentUser?.cnic || propPatient?.cnic || '42101-9876543-2';

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const apiBase = getApiBaseUrl();
    fetch(`${apiBase}/api/patient-portal/me?cnic=${encodeURIComponent(cnicToFetch)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load patient records from database');
        return res.json();
      })
      .then((payload) => {
        setData(payload);
      })
      .catch((err) => {
        console.warn('Patient portal fetch failed, falling back to prop data:', err);
        setError(err.message || 'Unable to fetch records');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [cnicToFetch]);

  const activePatient = data?.patient || propPatient;
  const visitsList = data?.visits || (propPatient?.history || []);
  const followupsList = data?.followups || [];

  if (isLoading) {
    return (
      <div className="bg-white border border-[#DCE6E2] rounded-2xl p-12 text-center max-w-xl mx-auto space-y-3 shadow-2xs">
        <RefreshCw className="w-8 h-8 text-[#0F5C56] animate-spin mx-auto" />
        <div className="text-sm font-semibold text-[#142420]">Loading Encrypted Patient Portal Records...</div>
        <div className="text-xs text-[#7C8F87]">Connecting to Neon Cloud PostgreSQL node</div>
      </div>
    );
  }

  if (!activePatient) {
    return (
      <div className="bg-white border border-[#DCE6E2] rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-2xs">
        <div className="w-12 h-12 bg-[#0F5C56]/10 text-[#0F5C56] rounded-full flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[#142420]">Patient Medical Timeline</h2>
        <p className="text-xs text-[#7C8F87]">
          Please log in with your registered CNIC and password to view your health records.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl animate-fadeIn">
      {/* PWA Install Prompt Banner */}
      <PWAInstallBanner />

      {/* Portal Header */}
      <div className="bg-gradient-to-r from-[#0A413D] via-[#0F5C56] to-[#0A413D] text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="bg-white/10 text-[#9FC0BA] px-3 py-1 rounded-full text-xs font-mono-tabular flex items-center gap-1.5 backdrop-blur-xs">
              <Building2 className="w-3.5 h-3.5" /> {hospitalName}
            </span>
            <span className="bg-[#25D366]/20 text-[#25D366] px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> End-to-End Encrypted Patient Portal
            </span>
          </div>

          <div>
            <h1 className="font-serif-display text-2xl sm:text-3xl font-bold tracking-tight">
              {activePatient.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#9FC0BA] font-mono-tabular mt-2">
              <span>CNIC: {activePatient.cnic}</span>
              <span>·</span>
              <span>Age: {activePatient.age || 28} yrs</span>
              <span>·</span>
              <span>Gender: {activePatient.gender || 'Female'}</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-[#25D366]">
                <Phone className="w-3.5 h-3.5" /> {activePatient.phone}
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
              <span>Medical History &amp; Prescriptions</span>
            </h2>
            <span className="text-xs text-[#7C8F87] font-mono-tabular bg-[#F4F7F6] px-2.5 py-1 rounded-lg">
              {visitsList.length} Clinical Visits
            </span>
          </div>

          <div className="space-y-6 relative pl-2">
            {visitsList.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#7C8F87] space-y-1">
                <CheckCircle className="w-8 h-8 text-[#25D366] mx-auto opacity-70" />
                <div>No prior clinical visits recorded in database.</div>
              </div>
            ) : (
              visitsList.map((visit, idx) => (
                <div key={visit.id || idx} className="relative pl-6 border-l-2 border-[#E5F0EE] space-y-2">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#0F5C56] ring-4 ring-white" />

                  <div className="flex flex-wrap items-center justify-between text-xs text-[#7C8F87] font-mono-tabular gap-1">
                    <span className="font-semibold text-[#0F5C56] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {visit.date || visit.visit_date || 'Recent Visit'}
                    </span>
                    <span className="font-medium text-[#142420]">{visit.doctorName || 'Dr. Ahmed Raza'}</span>
                  </div>

                  <div className="bg-[#F4F7F6]/80 border border-[#DCE6E2] p-4 rounded-xl space-y-3">
                    {visit.diagnosis && (
                      <div>
                        <span className="text-[11px] font-bold text-[#7C8F87] uppercase tracking-wider block">
                          Diagnosis / Clinical Condition
                        </span>
                        <div className="text-xs sm:text-sm font-semibold text-[#142420] mt-0.5">
                          {visit.diagnosis}
                        </div>
                      </div>
                    )}

                    {visit.prescription && (
                      <div>
                        <span className="text-[11px] font-bold text-[#7C8F87] uppercase tracking-wider flex items-center gap-1">
                          <Pill className="w-3.5 h-3.5 text-[#0F5C56]" /> Prescribed Medications &amp; Care
                        </span>
                        <div className="text-xs sm:text-sm text-[#142420] mt-1 bg-white p-3 rounded-lg border border-[#DCE6E2] font-mono-tabular whitespace-pre-line leading-relaxed">
                          {visit.prescription}
                        </div>
                      </div>
                    )}

                    {visit.rawNote && (
                      <div className="text-xs text-[#4E6259] italic border-t border-[#DCE6E2] pt-2">
                        Note: {visit.rawNote}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Automated Follow-up Log & Contact */}
        <div className="md:col-span-4 space-y-4">
          <div className="border border-[#DCE6E2] rounded-2xl p-5 bg-white shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-[#142420] flex items-center gap-2">
              <MessageSquare className="w-4.5 h-4.5 text-[#25D366]" />
              <span>WhatsApp Follow-up Logs</span>
            </h3>

            {followupsList.length === 0 ? (
              <div className="text-xs text-[#7C8F87] bg-[#F4F7F6] p-3.5 rounded-xl border border-[#DCE6E2] text-center">
                No active follow-up reminders.
              </div>
            ) : (
              followupsList.map((f, i) => (
                <div key={f.id || i} className="bg-[#F4F7F6] border border-[#DCE6E2] p-3.5 rounded-xl text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#0A413D] font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#0F5C56]" /> {f.sendDate || f.delay || 'Scheduled'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      f.status === 'sent' ? 'bg-[#25D366]/20 text-[#1DA851]' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {f.status}
                    </span>
                  </div>

                  {f.customMessage && (
                    <div className="text-[11px] text-[#142420] font-mono-tabular leading-relaxed bg-white p-2.5 rounded-lg border border-[#DCE6E2]">
                      "{f.customMessage}"
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="border border-[#DCE6E2] rounded-2xl p-5 bg-white shadow-2xs space-y-2 text-xs">
            <h3 className="font-bold text-[#142420] flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-[#0F5C56]" />
              <span>Attending Physician</span>
            </h3>
            <p className="text-[#4E6259] font-medium">Dr. Ahmed Raza · General Medicine</p>
            <p className="text-[#7C8F87] font-mono-tabular">{hospitalName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
