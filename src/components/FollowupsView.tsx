import React, { useState } from 'react';
import { FollowupRecord, Patient } from '../types';
import { MessageSquare, Send, CheckCircle2, Clock, Search, ExternalLink } from 'lucide-react';

interface FollowupsViewProps {
  followups: FollowupRecord[];
  patients: Patient[];
  onSendWhatsApp: (patient: Patient, customMsg: string) => void;
  onMarkSent: (followupId: string) => void;
}

export const FollowupsView: React.FC<FollowupsViewProps> = ({
  followups,
  patients,
  onSendWhatsApp,
  onMarkSent
}) => {
  const [filter, setFilter] = useState<'all' | 'due' | 'sent'>('all');
  const [search, setSearch] = useState('');

  const filteredFollowups = followups.filter((f) => {
    const matchesFilter = filter === 'all' || f.status === filter;
    const matchesSearch =
      f.patientName.toLowerCase().includes(search.toLowerCase()) ||
      f.phone.includes(search) ||
      f.diagnosisSummary.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-display text-2xl font-bold text-[#142420]">
            WhatsApp Follow-ups Log
          </h1>
          <p className="text-xs text-[#7C8F87] font-mono-tabular mt-0.5">
            Automated check-ins and recovery tracking
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 bg-white border border-[#DCE6E2] p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'all' ? 'bg-[#0F5C56] text-white shadow-2xs' : 'text-[#4E6259] hover:text-[#142420]'
            }`}
          >
            All ({followups.length})
          </button>
          <button
            onClick={() => setFilter('due')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'due' ? 'bg-[#C98A2C] text-white shadow-2xs' : 'text-[#4E6259] hover:text-[#142420]'
            }`}
          >
            Due ({followups.filter((f) => f.status === 'due').length})
          </button>
          <button
            onClick={() => setFilter('sent')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'sent' ? 'bg-[#25D366] text-[#06331A] shadow-2xs' : 'text-[#4E6259] hover:text-[#142420]'
            }`}
          >
            Sent ({followups.filter((f) => f.status === 'sent').length})
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-[#DCE6E2] rounded-2xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-[#DCE6E2] bg-[#F4F7F6]/50 flex items-center gap-3">
          <Search className="w-4 h-4 text-[#7C8F87]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter follow-up list by name or phone..."
            className="w-full bg-transparent border-none text-xs sm:text-sm text-[#142420] focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#F4F7F6] text-[11px] uppercase tracking-wider text-[#7C8F87] font-semibold border-b border-[#DCE6E2]">
              <tr>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Diagnosis / Visit</th>
                <th className="py-3 px-4">Scheduled Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F5F3]">
              {filteredFollowups.map((f) => {
                const patient = patients.find((p) => p.id === f.patientId) || {
                  id: f.patientId,
                  name: f.patientName,
                  phone: f.phone,
                  status: 'due',
                  note: '',
                  visitsCount: 1,
                  lastVisit: 'Today',
                  history: []
                };

                return (
                  <tr key={f.id} className="hover:bg-[#F4F7F6]/50 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-[#142420]">
                      <div className="font-semibold text-sm">{f.patientName}</div>
                      <div className="text-xs text-[#7C8F87] font-mono-tabular">{f.phone}</div>
                    </td>

                    <td className="py-3.5 px-4 text-[#4E6259]">
                      <div className="line-clamp-1 font-medium">{f.diagnosisSummary}</div>
                      <div className="text-[11px] text-[#7C8F87] line-clamp-1 mt-0.5">
                        "{f.customMessage || 'Assalam-o-Alaikum, this is Al-Noor Clinic...'}"
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono-tabular text-xs text-[#142420]">
                      {f.sendDate}
                    </td>

                    <td className="py-3.5 px-4">
                      {f.status === 'sent' ? (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E9FAF0] text-[#1DA851]">
                          <CheckCircle2 className="w-3 h-3" /> Sent
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FBF1DE] text-[#C98A2C]">
                          <Clock className="w-3 h-3" /> Due
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onSendWhatsApp(patient, f.customMessage || '')}
                          className="flex items-center gap-1 bg-[#25D366] hover:bg-[#1DA851] text-[#06331A] hover:text-white font-semibold text-xs py-1.5 px-3 rounded-lg transition-all"
                        >
                          <Send className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </button>
                        {f.status !== 'sent' && (
                          <button
                            onClick={() => onMarkSent(f.id)}
                            className="p-1.5 border border-[#DCE6E2] hover:bg-white text-[#7C8F87] hover:text-[#142420] rounded-lg transition-colors"
                            title="Mark as Sent"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
