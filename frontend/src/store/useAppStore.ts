import { useSyncExternalStore } from 'react';
import { ActiveView, Patient, FollowupRecord } from '../types';
import { initialPatients, initialFollowups } from '../data/initialData';

const STORAGE_KEY_PATIENTS = 'clinicbell_patients_v1';
const STORAGE_KEY_FOLLOWUPS = 'clinicbell_followups_v1';

// Helper to load persisted data from localStorage with fallback to initialData
function getInitialPatients(): Patient[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PATIENTS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Failed to load patients from localStorage:', err);
  }
  return initialPatients;
}

function getInitialFollowups(): FollowupRecord[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_FOLLOWUPS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Failed to load followups from localStorage:', err);
  }
  return initialFollowups;
}

export interface AppState {
  activeView: ActiveView;
  searchQuery: string;
  patients: Patient[];
  followups: FollowupRecord[];
  selectedPatient: Patient | null;
  isNewPatientModalOpen: boolean;
  isMobileSidebarOpen: boolean;

  // Actions
  setActiveView: (view: ActiveView) => void;
  setSearchQuery: (query: string) => void;
  setSelectedPatient: (patient: Patient | null) => void;
  setIsNewPatientModalOpen: (isOpen: boolean) => void;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
  addPatient: (newPatient: Patient) => void;
  updatePatient: (updatedPatient: Patient) => void;
  markFollowupSent: (followupId: string) => void;
  sendWhatsApp: (patient: Patient, customMsg?: string) => void;
}

class Store {
  private state: AppState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = {
      activeView: 'today',
      searchQuery: '',
      patients: getInitialPatients(),
      followups: getInitialFollowups(),
      selectedPatient: null,
      isNewPatientModalOpen: false,
      isMobileSidebarOpen: false,

      setActiveView: (view) => this.setState({ activeView: view, isMobileSidebarOpen: false }),
      setSearchQuery: (query) => this.setState({ searchQuery: query }),
      setSelectedPatient: (patient) => this.setState({ selectedPatient: patient }),
      setIsNewPatientModalOpen: (isOpen) => this.setState({ isNewPatientModalOpen: isOpen }),
      setIsMobileSidebarOpen: (isOpen) => this.setState({ isMobileSidebarOpen: isOpen }),

      addPatient: (newPatient) => {
        const updatedPatients = [newPatient, ...this.state.patients];
        let updatedFollowups = [...this.state.followups];

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
          updatedFollowups = [newFollowup, ...updatedFollowups];
        }

        this.setState({ patients: updatedPatients, followups: updatedFollowups });
        this.persist(updatedPatients, updatedFollowups);
      },

      updatePatient: (updatedPatient) => {
        const updatedPatients = this.state.patients.map((p) =>
          p.id === updatedPatient.id ? updatedPatient : p
        );

        let updatedFollowups = [...this.state.followups];
        const exists = updatedFollowups.some((f) => f.patientId === updatedPatient.id);

        if (exists) {
          updatedFollowups = updatedFollowups.map((f) =>
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
          updatedFollowups = [
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
            ...updatedFollowups
          ];
        }

        this.setState({
          patients: updatedPatients,
          followups: updatedFollowups,
          selectedPatient: updatedPatient
        });
        this.persist(updatedPatients, updatedFollowups);
      },

      markFollowupSent: (followupId) => {
        const updatedFollowups = this.state.followups.map((f) =>
          f.id === followupId ? { ...f, status: 'sent' as const } : f
        );
        this.setState({ followups: updatedFollowups });
        this.persist(this.state.patients, updatedFollowups);
      },

      sendWhatsApp: (patient, customMsg) => {
        const rawPhone = patient.phone.replace(/[^0-9]/g, '');
        const cleanPhone = rawPhone.startsWith('92') ? rawPhone : `92${rawPhone.replace(/^0/, '')}`;
        const text = encodeURIComponent(
          customMsg ||
            patient.followupMessage ||
            `Assalam-o-Alaikum ${patient.name}, this is Al-Noor Clinic following up on your visit. How are you feeling today?`
        );
        window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');

        const updatedPatients = this.state.patients.map((p) =>
          p.id === patient.id ? { ...p, status: 'sent' as const } : p
        );
        const updatedFollowups = this.state.followups.map((f) =>
          f.patientId === patient.id ? { ...f, status: 'sent' as const } : f
        );

        this.setState({ patients: updatedPatients, followups: updatedFollowups });
        this.persist(updatedPatients, updatedFollowups);
      }
    };
  }

  private persist(patients: Patient[], followups: FollowupRecord[]) {
    try {
      localStorage.setItem(STORAGE_KEY_PATIENTS, JSON.stringify(patients));
      localStorage.setItem(STORAGE_KEY_FOLLOWUPS, JSON.stringify(followups));
    } catch (err) {
      console.warn('Failed to save to localStorage:', err);
    }
  }

  getState = () => this.state;

  setState = (partial: Partial<AppState>) => {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach((listener) => listener());
  };

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };
}

const storeInstance = new Store();

export function useAppStore(): AppState;
export function useAppStore<T>(selector: (state: AppState) => T): T;
export function useAppStore<T>(selector?: (state: AppState) => T): T | AppState {
  const state = useSyncExternalStore(
    storeInstance.subscribe,
    storeInstance.getState,
    storeInstance.getState
  );

  return selector ? selector(state) : state;
}

useAppStore.getState = storeInstance.getState;
