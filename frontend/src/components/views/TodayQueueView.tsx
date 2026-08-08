import React from 'react';
import { Patient } from '../../types';
import { PatientCard } from '../PatientCard';

interface TodayQueueViewProps {
  queue: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onQuickWhatsApp: (patient: Patient, e: React.MouseEvent) => void;
  onOpenNewPatientModal: () => void;
}

export const TodayQueueView: React.FC<TodayQueueViewProps> = ({
  queue,
  onSelectPatient,
  onQuickWhatsApp,
  onOpenNewPatientModal
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h1 className="font-serif-display text-2xl font-bold text-[#142420]">
            Today's Queue
          </h1>
          <p className="text-xs text-[#7C8F87] font-mono-tabular mt-0.5">
            Torn prescription-slip cards · Click card to view history & dictation
          </p>
        </div>
        <span className="text-xs text-[#7C8F87] font-mono-tabular">
          {queue.length} checked in today
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {queue.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            onSelect={onSelectPatient}
            onQuickWhatsApp={onQuickWhatsApp}
          />
        ))}
      </div>

      {queue.length === 0 && (
        <div className="bg-white border border-[#DCE6E2] rounded-2xl p-12 text-center space-y-3">
          <div className="text-[#7C8F87] font-medium text-sm">
            No patients match your search filter or checked in today.
          </div>
          <button
            onClick={onOpenNewPatientModal}
            className="text-xs text-[#0F5C56] font-semibold underline hover:text-[#0A413D]"
          >
            Check in a new patient
          </button>
        </div>
      )}
    </div>
  );
};
