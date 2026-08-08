import React from 'react';
import { useAppStore } from './store/useAppStore';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { BottomNav } from './components/layout/BottomNav';
import { PWAInstallBanner } from './components/ui/PWAInstallBanner';
import { OfflineBanner } from './components/ui/OfflineBanner';
import { TodayQueueView } from './components/views/TodayQueueView';
import { PatientsView } from './components/views/PatientsView';
import { FollowupsView } from './components/FollowupsView';
import { SettingsView } from './components/SettingsView';
import { AdminView } from './components/AdminView';
import { PatientPortalView } from './components/PatientPortalView';
import { AuthModal } from './components/AuthModal';
import { PatientDrawer } from './components/PatientDrawer';
import { NewPatientModal } from './components/NewPatientModal';

export default function App() {
  const {
    activeView,
    searchQuery,
    patients,
    followups,
    doctors,
    customers,
    selectedPatient,
    isNewPatientModalOpen,
    isAuthModalOpen,
    userRole,
    currentUser,

    setActiveView,
    setSearchQuery,
    setSelectedPatient,
    setIsNewPatientModalOpen,
    setIsAuthModalOpen,
    loginUser,
    addDoctor,
    addCustomer,
    addPatient,
    updatePatient,
    markFollowupSent,
    sendWhatsApp
  } = useAppStore();

  const todayStr = new Date().toISOString().split('T')[0];

  // Search filter
  const filterPatient = (patient: typeof patients[0]) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      patient.name.toLowerCase().includes(q) ||
      patient.phone.toLowerCase().includes(q) ||
      patient.note.toLowerCase().includes(q) ||
      (patient.age && patient.age.toString().includes(q))
    );
  };

  // Queue filtered by today's checked-in patients
  const todayQueue = patients.filter(
    (p) => filterPatient(p) && (p.checkedInDate === todayStr || p.lastVisit === 'Today' || p.status === 'new')
  );
  const allPatientsList = patients.filter(filterPatient);

  const handleQuickWhatsApp = (patient: typeof patients[0], e: React.MouseEvent) => {
    e.stopPropagation();
    sendWhatsApp(patient);
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] text-[#142420] font-sans antialiased flex flex-col md:flex-row pb-16 md:pb-0">
      {/* Sidebar Desktop */}
      <div className="hidden md:block w-64 shrink-0">
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          queueCount={todayQueue.length}
          patientsCount={patients.length}
          followupsCount={followups.length}
          onOpenNewPatientModal={() => setIsNewPatientModalOpen(true)}
        />
      </div>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <OfflineBanner />
        <PWAInstallBanner />

        <Topbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          queueCount={todayQueue.length}
          userRole={userRole}
          onOpenNewPatientModal={() => setIsNewPatientModalOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* TODAY'S QUEUE VIEW */}
          {activeView === 'today' && (
            <TodayQueueView
              queue={todayQueue}
              onSelectPatient={(p) => setSelectedPatient(p)}
              onQuickWhatsApp={handleQuickWhatsApp}
              onOpenNewPatientModal={() => setIsNewPatientModalOpen(true)}
            />
          )}

          {/* ALL PATIENTS VIEW */}
          {activeView === 'patients' && (
            <PatientsView
              patients={allPatientsList}
              onSelectPatient={(p) => setSelectedPatient(p)}
              onQuickWhatsApp={handleQuickWhatsApp}
            />
          )}

          {/* FOLLOW-UPS LOG VIEW */}
          {activeView === 'followups' && (
            <FollowupsView
              followups={followups}
              patients={patients}
              onSendWhatsApp={(p, msg) => sendWhatsApp(p, msg)}
              onMarkSent={markFollowupSent}
            />
          )}

          {/* ADMIN CONTROL PANEL */}
          {activeView === 'admin' && (
            <AdminView
              doctors={doctors}
              customers={customers}
              onAddDoctor={addDoctor}
              onAddCustomer={addCustomer}
            />
          )}

          {/* CUSTOMER / PATIENT PORTAL */}
          {activeView === 'patient-portal' && (
            <PatientPortalView
              patient={selectedPatient || patients[0] || null}
              hospitalName={currentUser?.hospitalName}
            />
          )}

          {/* SETTINGS VIEW */}
          {activeView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeView={activeView}
        setActiveView={setActiveView}
        queueCount={todayQueue.length}
        patientsCount={patients.length}
        followupsCount={followups.length}
      />

      {/* Patient Detail Drawer */}
      <PatientDrawer
        patient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
        onUpdatePatient={updatePatient}
        onSendWhatsApp={(p, msg) => sendWhatsApp(p, msg)}
      />

      {/* New Patient Modal */}
      <NewPatientModal
        isOpen={isNewPatientModalOpen}
        onClose={() => setIsNewPatientModalOpen(false)}
        onAddPatient={addPatient}
      />

      {/* Authorization Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={loginUser}
      />
    </div>
  );
}
