import React, { useState } from 'react';
import { ActiveView, Patient, FollowupRecord } from './types';
import { initialPatients, initialFollowups } from './data/initialData';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { PatientCard } from './components/PatientCard';
import { PatientDrawer } from './components/PatientDrawer';
import { NewPatientModal } from './components/NewPatientModal';
import { FollowupsView } from './components/FollowupsView';
import { SettingsView } from './components/SettingsView';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [followups, setFollowups] = useState<FollowupRecord[]>(initialFollowups);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Filter patients by search query
  const filterPatient = (patient: Patient) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      patient.name.toLowerCase().includes(q) ||
      patient.phone.toLowerCase().includes(q) ||
      patient.note.toLowerCase().includes(q) ||
      (patient.age && patient.age.toString().includes(q))
    );
  };

  const todayQueue = patients.filter(filterPatient);
  const allPatientsList = patients.filter(filterPatient);

  // Quick WhatsApp Launcher
  const handleSendWhatsApp = (patient: Patient, customMsg?: string) => {
    const rawPhone = patient.phone.replace(/[^0-9]/g, '');
    const cleanPhone = rawPhone.startsWith('92') ? rawPhone : `92${rawPhone.replace(/^0/, '')}`;
    const text = encodeURIComponent(
      customMsg ||
        patient.followupMessage ||
        `Assalam-o-Alaikum ${patient.name}, this is Al-Noor Clinic following up on your visit. How are you feeling today?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');

    // Mark status as sent
    setPatients((prev) =>
      prev.map((p) => (p.id === patient.id ? { ...p, status: 'sent' as const } : p))
    );
    setFollowups((prev) =>
      prev.map((f) => (f.patientId === patient.id ? { ...f, status: 'sent' as const } : f))
    );
  };

  // Add new patient to state
  const handleAddPatient = (newPatient: Patient) => {
    setPatients((prev) => [newPatient, ...prev]);
    if (newPatient.followupEnabled) {
      const newFollowup: FollowupRecord = {
        id: `F-${Date.now().toString().slice(-4)}`,
        patientId: newPatient.id,
        patientName: newPatient.name,
        phone: newPatient.phone,
        diagnosisSummary: newPatient.note,
        sendDate: 'In 2 weeks',
        status: 'due',
        delay: '2 weeks',
        customMessage: newPatient.followupMessage
      };
      setFollowups((prev) => [newFollowup, ...prev]);
    }
  };

  // Update existing patient
  const handleUpdatePatient = (updatedPatient: Patient) => {
    setPatients((prev) => prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p)));
    setSelectedPatient(updatedPatient);

    // Update followups log
    setFollowups((prev) => {
      const exists = prev.some((f) => f.patientId === updatedPatient.id);
      if (exists) {
        return prev.map((f) =>
          f.patientId === updatedPatient.id
            ? {
                ...f,
                diagnosisSummary: updatedPatient.note,
                customMessage: updatedPatient.followupMessage,
                delay: updatedPatient.followupDelay || '2 weeks'
              }
            : f
        );
      } else if (updatedPatient.followupEnabled) {
        return [
          {
            id: `F-${Date.now().toString().slice(-4)}`,
            patientId: updatedPatient.id,
            patientName: updatedPatient.name,
            phone: updatedPatient.phone,
            diagnosisSummary: updatedPatient.note,
            sendDate: `In ${updatedPatient.followupDelay || '2 weeks'}`,
            status: 'due',
            delay: updatedPatient.followupDelay || '2 weeks',
            customMessage: updatedPatient.followupMessage
          },
          ...prev
        ];
      }
      return prev;
    });
  };

  // Mark follow-up as sent
  const handleMarkFollowupSent = (followupId: string) => {
    setFollowups((prev) =>
      prev.map((f) => (f.id === followupId ? { ...f, status: 'sent' as const } : f))
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] text-[#142420] font-sans antialiased flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <div className="hidden md:block w-64 shrink-0">
        <Sidebar
          activeView={activeView}
          setActiveView={(view) => {
            setActiveView(view);
            setIsMobileSidebarOpen(false);
          }}
          queueCount={todayQueue.length}
          patientsCount={patients.length}
          followupsCount={followups.length}
          onOpenNewPatientModal={() => setIsNewPatientModalOpen(true)}
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      {isMobileSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsMobileSidebarOpen(false)}
        >
          <div className="w-64 h-full" onClick={(e) => e.stopPropagation()}>
            <Sidebar
              activeView={activeView}
              setActiveView={(view) => {
                setActiveView(view);
                setIsMobileSidebarOpen(false);
              }}
              queueCount={todayQueue.length}
              patientsCount={patients.length}
              followupsCount={followups.length}
              onOpenNewPatientModal={() => {
                setIsNewPatientModalOpen(true);
                setIsMobileSidebarOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <Topbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          queueCount={todayQueue.length}
          onOpenNewPatientModal={() => setIsNewPatientModalOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* TODAY'S QUEUE VIEW */}
          {activeView === 'today' && (
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
                  {todayQueue.length} checked in
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {todayQueue.map((patient) => (
                  <PatientCard
                    key={patient.id}
                    patient={patient}
                    onSelect={(p) => setSelectedPatient(p)}
                    onQuickWhatsApp={(p, e) => {
                      e.stopPropagation();
                      handleSendWhatsApp(p);
                    }}
                  />
                ))}
              </div>

              {todayQueue.length === 0 && (
                <div className="bg-white border border-[#DCE6E2] rounded-2xl p-12 text-center space-y-3">
                  <div className="text-[#7C8F87] font-medium text-sm">
                    No patients match your search filter.
                  </div>
                  <button
                    onClick={() => setIsNewPatientModalOpen(true)}
                    className="text-xs text-[#0F5C56] font-semibold underline"
                  >
                    Check in a new patient
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ALL PATIENTS VIEW */}
          {activeView === 'patients' && (
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
                  {allPatientsList.length} total records
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {allPatientsList.map((patient) => (
                  <PatientCard
                    key={patient.id}
                    patient={patient}
                    onSelect={(p) => setSelectedPatient(p)}
                    onQuickWhatsApp={(p, e) => {
                      e.stopPropagation();
                      handleSendWhatsApp(p);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* FOLLOW-UPS LOG VIEW */}
          {activeView === 'followups' && (
            <FollowupsView
              followups={followups}
              patients={patients}
              onSendWhatsApp={handleSendWhatsApp}
              onMarkSent={handleMarkFollowupSent}
            />
          )}

          {/* SETTINGS VIEW */}
          {activeView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Patient Detail Drawer */}
      <PatientDrawer
        patient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
        onUpdatePatient={handleUpdatePatient}
        onSendWhatsApp={handleSendWhatsApp}
      />

      {/* New Patient Modal */}
      <NewPatientModal
        isOpen={isNewPatientModalOpen}
        onClose={() => setIsNewPatientModalOpen(false)}
        onAddPatient={handleAddPatient}
      />
    </div>
  );
}
