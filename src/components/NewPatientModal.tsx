import React, { useState } from 'react';
import { Patient } from '../types';
import { X, UserPlus, Phone, User, FileText } from 'lucide-react';

interface NewPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (newPatient: Patient) => void;
}

export const NewPatientModal: React.FC<NewPatientModalProps> = ({
  isOpen,
  onClose,
  onAddPatient
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const formattedPhone = phone.startsWith('+92') ? phone : `+92 ${phone.replace(/^0/, '')}`;

    const newPatient: Patient = {
      id: `P-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name.trim(),
      phone: formattedPhone,
      age: age ? parseInt(age, 10) : undefined,
      gender,
      status: 'new',
      note: note.trim() || 'First visit today — checked in at reception.',
      visitsCount: 1,
      lastVisit: 'Today',
      checkedInAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      followupEnabled: true,
      followupDelay: '2 weeks',
      followupMessage: `Assalam-o-Alaikum ${name.trim()}, this is Al-Noor Clinic following up on your visit today with Dr. Ahmed Raza. How are you feeling now?`,
      history: [
        {
          id: `v-${Date.now().toString().slice(-4)}`,
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          text: `Checked in at reception: ${note.trim() || 'General Consultation'}`
        }
      ]
    };

    onAddPatient(newPatient);
    setName('');
    setPhone('');
    setAge('');
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#0A1412]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#DCE6E2] animate-scaleUp">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#F4F7F6] border-b border-[#DCE6E2] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0F5C56] text-white flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-display text-lg font-bold text-[#142420]">
                Check In New Patient
              </h2>
              <p className="text-xs text-[#7C8F87]">
                Add patient to today's clinical queue
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#7C8F87] hover:text-[#142420] hover:bg-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#4E6259] mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7C8F87]" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sana Malik"
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#DCE6E2] rounded-xl text-sm text-[#142420] focus:outline-none focus:border-[#0F5C56]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4E6259] mb-1">
              Phone Number (+92 WhatsApp) *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7C8F87]" />
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="300 1234567"
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#DCE6E2] rounded-xl text-sm font-mono-tabular text-[#142420] focus:outline-none focus:border-[#0F5C56]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4E6259] mb-1">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 32"
                className="w-full px-3 py-2 bg-white border border-[#DCE6E2] rounded-xl text-sm text-[#142420] focus:outline-none focus:border-[#0F5C56]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4E6259] mb-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-[#DCE6E2] rounded-xl text-sm text-[#142420] focus:outline-none focus:border-[#0F5C56]"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4E6259] mb-1">
              Chief Complaint / Reason for Visit
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. High fever, headache, body ache for 2 days"
              className="w-full h-20 px-3 py-2 bg-white border border-[#DCE6E2] rounded-xl text-sm text-[#142420] focus:outline-none focus:border-[#0F5C56]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F0F5F3]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#DCE6E2] rounded-xl text-xs font-semibold text-[#4E6259] hover:bg-[#F4F7F6] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0F5C56] hover:bg-[#0A413D] text-white rounded-xl text-xs font-semibold transition-all shadow-xs active:scale-95"
            >
              Add to Today's Queue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
