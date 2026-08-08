import React, { useState } from 'react';
import { UserRole } from '../types';
import { ShieldCheck, Key, Building2, User, Stethoscope, Users, X, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (cnic: string, role: UserRole, hospitalName: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [hospitalName, setHospitalName] = useState('GDGDemo Hospital — Al-Noor Clinic');
  const [cnic, setCnic] = useState('42101-1234567-1');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState<UserRole>('doctor');

  if (!isOpen) return null;

  const formatCnicInput = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 13);
    if (digits.length <= 5) return digits;
    if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cnic.trim()) return;
    onLogin(cnic.trim(), selectedRole, hospitalName);
    onClose();
  };

  const handleQuickDemoRole = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'admin') {
      setCnic('42101-0000000-0');
    } else if (role === 'doctor') {
      setCnic('42101-1234567-1');
    } else {
      setCnic('42101-9876543-2');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white text-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-[#DCE6E2] overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-[#25D366] to-[#0F5C56] text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="font-serif-display text-2xl font-bold text-[#142420]">
            ClinicBell Authorization
          </h2>
          <p className="text-xs text-[#7C8F87] font-mono-tabular mt-1">
            End-to-End Encrypted Hospital Authentication Node
          </p>
        </div>

        {/* Quick Role Switcher Buttons */}
        <div className="flex bg-[#F4F7F6] p-1.5 rounded-xl border border-[#DCE6E2] mb-5 text-xs">
          <button
            type="button"
            onClick={() => handleQuickDemoRole('doctor')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              selectedRole === 'doctor'
                ? 'bg-[#0F5C56] text-white shadow-xs'
                : 'text-[#4E6259] hover:text-[#142420]'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" /> Doctor
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoRole('patient')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              selectedRole === 'patient'
                ? 'bg-[#0F5C56] text-white shadow-xs'
                : 'text-[#4E6259] hover:text-[#142420]'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Customer
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoRole('admin')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              selectedRole === 'admin'
                ? 'bg-[#0F5C56] text-white shadow-xs'
                : 'text-[#4E6259] hover:text-[#142420]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Admin
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-semibold text-[#142420] mb-1">Select Hospital Node</label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-[#7C8F87] absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#F4F7F6] border border-[#DCE6E2] rounded-xl text-[#142420] focus:outline-none focus:border-[#0F5C56]"
              >
                <option value="GDGDemo Hospital — Al-Noor Clinic">GDGDemo Hospital — Al-Noor Clinic</option>
                <option value="Shifa Medical Complex">Shifa Medical Complex</option>
                <option value="Aga Khan University Hospital Node">Aga Khan University Hospital Node</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#142420] mb-1">CNIC Number</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#7C8F87] absolute left-3 top-1/2 -translate-y-1/2 z-10" />
              <input
                type="text"
                value={cnic}
                onChange={(e) => setCnic(formatCnicInput(e.target.value))}
                placeholder="42101-1234567-1"
                maxLength={18}
                required
                className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-[#DCE6E2] rounded-xl font-mono-tabular text-[#142420] placeholder:text-[#7C8F87] focus:outline-none focus:border-[#0F5C56] font-semibold"
                style={{ color: '#142420' }}
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#142420] mb-1">Account Password</label>
            <div className="relative">
              <Key className="w-4 h-4 text-[#7C8F87] absolute left-3 top-1/2 -translate-y-1/2 z-10" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-[#DCE6E2] rounded-xl text-[#142420] placeholder:text-[#7C8F87] focus:outline-none focus:border-[#0F5C56] font-semibold"
                style={{ color: '#142420' }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-3 bg-[#0F5C56] hover:bg-[#0A413D] text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
          >
            <span>Authenticate as {selectedRole.toUpperCase()}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
