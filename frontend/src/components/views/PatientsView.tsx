import React from 'react';
import { Patient } from '../../types';
import { PatientCard } from '../PatientCard';

interface PatientsViewProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onQuickWhatsApp: (patient: Patient, e: React.MouseEvent) => void;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  patients,
  onSelectPatient,
  onQuickWhatsApp
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h1 className="font-serif-display text-2xl font-bold text-[#142420]">
            All Patient Records
          </h1>
          <p className="text-xs text-[#7C8F87] font-mono-tabular mt-0.5">
            Complete medical records index
          </p>
        </div>
        <span className="text-xs text-[#7C8F87] font-mono-tabular">
          {patients.length} total records
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {patients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            onSelect={onSelectPatient}
            onQuickWhatsApp={onQuickWhatsApp}
          />
        ))}
      </div>
    </div>
  );
};
