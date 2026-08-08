import React, { useState } from 'react';
import { UserRole } from '../types';
import { LoginRequestDto } from '../dtos';
import {
  ShieldCheck,
  Building2,
  User,
  Key,
  Stethoscope,
  Users,
  ArrowRight,
  Sparkles,
  Lock,
  PhoneCall
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (dto: LoginRequestDto) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [hospitalName, setHospitalName] = useState('GDGDemo Hospital — Al-Noor Clinic');
  const [cnic, setCnic] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('doctor');
  const [isLoading, setIsLoading] = useState(false);

  const formatCnicInput = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 13);
    if (digits.length <= 5) return digits;
    if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cnic.trim() || !password.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        cnic: cnic.trim(),
        password: password.trim(),
        hospitalName,
        role: selectedRole
      });
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#072B28] via-[#0A413D] to-[#0F5C56] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Ambient Circles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#25D366]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#0F5C56]/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphism Login Container */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl text-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 border border-white/20 animate-scaleUp">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[#25D366] to-[#0F5C56] text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#0F5C56]/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#142420] tracking-tight">
            ClinicBell
          </h1>
          <p className="text-xs text-[#7C8F87] font-mono-tabular mt-1">
            End-to-End Encrypted Healthcare Portal
          </p>
        </div>

        {/* Role Switcher Selector */}
        <div className="flex bg-[#F4F7F6] p-1.5 rounded-2xl border border-[#DCE6E2] mb-6 text-xs">
          <button
            type="button"
            onClick={() => handleRoleSelect('doctor')}
            className={`flex-1 py-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedRole === 'doctor'
                ? 'bg-[#0F5C56] text-white shadow-sm'
                : 'text-[#4E6259] hover:text-[#142420]'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Doctor</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('patient')}
            className={`flex-1 py-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedRole === 'patient'
                ? 'bg-[#0F5C56] text-white shadow-sm'
                : 'text-[#4E6259] hover:text-[#142420]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customer</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('admin')}
            className={`flex-1 py-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedRole === 'admin'
                ? 'bg-[#0F5C56] text-white shadow-sm'
                : 'text-[#4E6259] hover:text-[#142420]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin</span>
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-[#142420] mb-1.5">Select Hospital Node</label>
            <div className="relative">
              <Building2 className="w-4.5 h-4.5 text-[#7C8F87] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
              <select
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-[#DCE6E2] rounded-xl text-[#142420] focus:outline-none focus:border-[#0F5C56] font-semibold text-xs sm:text-sm shadow-xs"
                style={{ color: '#142420' }}
              >
                <option value="GDGDemo Hospital — Al-Noor Clinic">GDGDemo Hospital — Al-Noor Clinic</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#142420] mb-1.5">CNIC Number</label>
            <div className="relative">
              <User className="w-4.5 h-4.5 text-[#7C8F87] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
              <input
                type="text"
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
                placeholder="42101-1234567-1"
                maxLength={20}
                required
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-[#DCE6E2] rounded-xl font-mono-tabular text-[#142420] placeholder:text-[#7C8F87] focus:outline-none focus:border-[#0F5C56] font-semibold text-xs sm:text-sm shadow-xs"
                style={{ color: '#142420' }}
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#142420] mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4.5 h-4.5 text-[#7C8F87] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-[#DCE6E2] rounded-xl text-[#142420] placeholder:text-[#7C8F87] focus:outline-none focus:border-[#0F5C56] font-semibold text-xs sm:text-sm shadow-xs"
                style={{ color: '#142420' }}
              />
            </div>
          </div>

          <div className="text-[11px] text-[#7C8F87] bg-[#F4F7F6] p-3 rounded-xl border border-[#DCE6E2] flex items-center gap-2">
            <PhoneCall className="w-3.5 h-3.5 text-[#0F5C56] shrink-0" />
            <span>Credentials are sent via WhatsApp upon hospital registration.</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-[#0F5C56] hover:bg-[#0A413D] text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Access {selectedRole.toUpperCase()} Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer Copy */}
      <div className="mt-6 text-center text-xs text-[#9FC0BA] font-mono-tabular relative z-10">
        ClinicBell Multi-Hospital Cloud Node · Private Network E2E Encrypted
      </div>
    </div>
  );
};
