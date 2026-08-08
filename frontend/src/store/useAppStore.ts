import { useSyncExternalStore } from 'react';
import { ActiveView, Patient, FollowupRecord, UserRole, User, DoctorRecord, CustomerRecord } from '../types';
import { getApiBaseUrl } from '../config';

const STORAGE_KEY_TOKEN = 'clinicbell_jwt_token_v1';
const STORAGE_KEY_USER = 'clinicbell_user_session_v1';
const STORAGE_KEY_EXPIRES = 'clinicbell_session_expires_v1';

function getInitialSession(): { user: User | null; role: UserRole; isAuthenticated: boolean } {
  try {
    const token = localStorage.getItem(STORAGE_KEY_TOKEN);
    const userJson = localStorage.getItem(STORAGE_KEY_USER);
    const expiresStr = localStorage.getItem(STORAGE_KEY_EXPIRES);

    if (token && userJson && expiresStr) {
      const expiresAt = Number(expiresStr);
      if (Date.now() < expiresAt) {
        const user = JSON.parse(userJson) as User;
        return { user, role: user.role, isAuthenticated: true };
      }
    }
  } catch (err) {
    console.warn('Failed to restore session from localStorage:', err);
  }
  return { user: null, role: 'doctor', isAuthenticated: false };
}

export interface AppState {
  activeView: ActiveView;
  searchQuery: string;
  patients: Patient[];
  followups: FollowupRecord[];
  doctors: DoctorRecord[];
  customers: CustomerRecord[];
  selectedPatient: Patient | null;
  isNewPatientModalOpen: boolean;
  isMobileSidebarOpen: boolean;
  isAuthModalOpen: boolean;
  isAuthenticated: boolean;
  userRole: UserRole;
  currentUser: User | null;
  jwtToken: string | null;
  isLoadingData: boolean;

  // Actions
  setActiveView: (view: ActiveView) => void;
  setSearchQuery: (query: string) => void;
  setSelectedPatient: (patient: Patient | null) => void;
  setIsNewPatientModalOpen: (isOpen: boolean) => void;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
  setIsAuthModalOpen: (isOpen: boolean) => void;
  fetchInitialData: () => Promise<void>;
  loginUser: (userObj: any, token?: string) => void;
  logoutUser: () => void;
  addDoctor: (doctor: Omit<DoctorRecord, 'id' | 'registeredAt'>, password: string) => Promise<void>;
  addCustomer: (customer: Omit<CustomerRecord, 'id' | 'registeredAt'>, password: string) => Promise<void>;
  addPatient: (newPatient: Patient) => Promise<void>;
  updatePatient: (updatedPatient: Patient) => void;
  markFollowupSent: (followupId: string) => void;
  sendWhatsApp: (patient: Patient, customMsg?: string) => void;
}

class Store {
  private state: AppState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    const session = getInitialSession();
    let initialView: ActiveView = 'today';
    if (session.isAuthenticated && session.role === 'admin') initialView = 'admin';
    if (session.isAuthenticated && session.role === 'patient') initialView = 'patient-portal';

    this.state = {
      activeView: initialView,
      searchQuery: '',
      patients: [],
      followups: [],
      doctors: [],
      customers: [],
      selectedPatient: null,
      isNewPatientModalOpen: false,
      isMobileSidebarOpen: false,
      isAuthModalOpen: false,
      isAuthenticated: session.isAuthenticated,
      userRole: session.role,
      currentUser: session.user,
      jwtToken: localStorage.getItem(STORAGE_KEY_TOKEN),
      isLoadingData: true,

      setActiveView: (view) => this.setState({ activeView: view, isMobileSidebarOpen: false }),
      setSearchQuery: (query) => this.setState({ searchQuery: query }),
      setSelectedPatient: (patient) => this.setState({ selectedPatient: patient }),
      setIsNewPatientModalOpen: (isOpen) => this.setState({ isNewPatientModalOpen: isOpen }),
      setIsMobileSidebarOpen: (isOpen) => this.setState({ isMobileSidebarOpen: isOpen }),
      setIsAuthModalOpen: (isOpen) => this.setState({ isAuthModalOpen: isOpen }),

      fetchInitialData: async () => {
        const apiBase = getApiBaseUrl();
        this.setState({ isLoadingData: true });
        try {
          const [docsRes, custsRes, ptsRes, folRes] = await Promise.allSettled([
            fetch(`${apiBase}/api/admin/doctors`).then(r => r.json()),
            fetch(`${apiBase}/api/admin/customers`).then(r => r.json()),
            fetch(`${apiBase}/api/patients`).then(r => r.json()),
            fetch(`${apiBase}/api/patients/followups`).then(r => r.json())
          ]);

          const doctors = docsRes.status === 'fulfilled' && Array.isArray(docsRes.value) ? docsRes.value : [];
          const customers = custsRes.status === 'fulfilled' && Array.isArray(custsRes.value) ? custsRes.value : [];
          const patients = ptsRes.status === 'fulfilled' && Array.isArray(ptsRes.value) ? ptsRes.value : [];
          const followups = folRes.status === 'fulfilled' && Array.isArray(folRes.value) ? folRes.value : [];

          this.setState({
            doctors,
            customers,
            patients,
            followups,
            isLoadingData: false
          });
        } catch (err) {
          console.warn('[Store] Error fetching initial data from backend DB:', err);
          this.setState({ isLoadingData: false });
        }
      },

      loginUser: (userObj: any, token?: string) => {
        const role: UserRole = userObj.role || 'doctor';
        let targetView: ActiveView = 'today';
        if (role === 'admin') targetView = 'admin';
        if (role === 'patient') targetView = 'patient-portal';

        const user: User = {
          id: userObj.id || `u-${Date.now().toString().slice(-4)}`,
          cnic: userObj.cnic,
          name: userObj.name || (role === 'doctor' ? 'Dr. Ahmed Raza' : 'Fatima Tariq'),
          phone: userObj.phone || '+92 300 1234567',
          role: role,
          hospitalName: userObj.hospitalName || 'GDGDemo Hospital',
          specialty: userObj.specialty,
          age: userObj.age,
          gender: userObj.gender
        };

        const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
        try {
          if (token) localStorage.setItem(STORAGE_KEY_TOKEN, token);
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
          localStorage.setItem(STORAGE_KEY_EXPIRES, expiresAt.toString());
        } catch (e) {}

        this.setState({
          currentUser: user,
          userRole: role,
          isAuthenticated: true,
          jwtToken: token || null,
          activeView: targetView
        });

        // Refresh all DB data upon login
        this.state.fetchInitialData();
      },

      logoutUser: () => {
        try {
          localStorage.removeItem(STORAGE_KEY_TOKEN);
          localStorage.removeItem(STORAGE_KEY_USER);
          localStorage.removeItem(STORAGE_KEY_EXPIRES);
        } catch (e) {}

        this.setState({
          currentUser: null,
          isAuthenticated: false,
          jwtToken: null,
          activeView: 'today'
        });
      },

      addDoctor: async (docData, password) => {
        const apiBase = getApiBaseUrl();
        try {
          const res = await fetch(`${apiBase}/api/admin/doctors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...docData, password })
          });
          if (res.ok) {
            const newDoctor = await res.json();
            this.setState({ doctors: [newDoctor, ...this.state.doctors] });
          }
        } catch (err) {
          console.error('Failed to register doctor in DB:', err);
        }
      },

      addCustomer: async (custData, password) => {
        const apiBase = getApiBaseUrl();
        try {
          const res = await fetch(`${apiBase}/api/admin/customers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...custData, password })
          });
          if (res.ok) {
            const newCustomer = await res.json();
            this.setState({ customers: [newCustomer, ...this.state.customers] });
            this.state.fetchInitialData();
          }
        } catch (err) {
          console.error('Failed to register customer in DB:', err);
        }
      },

      addPatient: async (newPatient) => {
        const apiBase = getApiBaseUrl();
        try {
          const res = await fetch(`${apiBase}/api/patients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPatient)
          });
          if (res.ok) {
            const created = await res.json();
            this.setState({ patients: [created, ...this.state.patients] });
          }
        } catch (err) {
          console.error('Failed to create patient in DB:', err);
        }
      },

      updatePatient: (updatedPatient) => {
        const updatedPatients = this.state.patients.map((p) =>
          p.id === updatedPatient.id ? updatedPatient : p
        );
        this.setState({
          patients: updatedPatients,
          selectedPatient: updatedPatient
        });
      },

      markFollowupSent: (followupId) => {
        const updatedFollowups = this.state.followups.map((f) =>
          f.id === followupId ? { ...f, status: 'sent' as const } : f
        );
        this.setState({ followups: updatedFollowups });
      },

      sendWhatsApp: (patient, customMsg) => {
        const rawPhone = patient.phone.replace(/[^0-9]/g, '');
        const cleanPhone = rawPhone.startsWith('92') ? rawPhone : `92${rawPhone.replace(/^0/, '')}`;
        const text = encodeURIComponent(
          customMsg ||
            patient.followupMessage ||
            `Assalam-o-Alaikum ${patient.name}, this is GDGDemo Hospital following up on your visit. How are you feeling today?`
        );
        window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
      }
    };

    // Auto-fetch database records on mount
    this.state.fetchInitialData();
  }

  public getState(): AppState {
    return this.state;
  }

  public setState(partialState: Partial<AppState>): void {
    this.state = { ...this.state, ...partialState };
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }
}

export const store = new Store();

export function useAppStore(): AppState {
  return useSyncExternalStore(
    (listener) => store.subscribe(listener),
    () => store.getState()
  );
}
