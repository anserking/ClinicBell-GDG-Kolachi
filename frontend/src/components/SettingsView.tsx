import React, { useState } from 'react';
import { Settings, Check, Stethoscope, Phone, MessageSquare, Globe, Shield } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [clinicName, setClinicName] = useState('Al-Noor Clinic');
  const [doctorName, setDoctorName] = useState('Dr. Ahmed Raza');
  const [senderPhone, setSenderPhone] = useState('+92 300 1234567');
  const [defaultDelay, setDefaultDelay] = useState('2 weeks');
  const [template, setTemplate] = useState(
    'Assalam-o-Alaikum, this is Al-Noor Clinic. How are you feeling since your last visit? Reply if you need to see the doctor again.'
  );
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-serif-display text-2xl font-bold text-[#142420]">
          Clinic Settings &amp; Preferences
        </h1>
        <p className="text-xs text-[#7C8F87] font-mono-tabular mt-0.5">
          Configure ClinicBell defaults and WhatsApp follow-up messaging
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Clinic Identity */}
        <div className="bg-white border border-[#DCE6E2] rounded-2xl p-6 space-y-4 shadow-2xs">
          <h2 className="text-base font-bold text-[#142420] flex items-center gap-2">
            <Stethoscope className="w-4.5 h-4.5 text-[#0F5C56]" />
            <span>Clinic Identity</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#4E6259] mb-1">
                Clinic Name
              </label>
              <input
                type="text"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DCE6E2] rounded-xl text-sm text-[#142420] focus:outline-none focus:border-[#0F5C56]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4E6259] mb-1">
                Attending Physician Name
              </label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DCE6E2] rounded-xl text-sm text-[#142420] focus:outline-none focus:border-[#0F5C56]"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp Integration */}
        <div className="bg-white border border-[#DCE6E2] rounded-2xl p-6 space-y-4 shadow-2xs">
          <h2 className="text-base font-bold text-[#142420] flex items-center gap-2">
            <MessageSquare className="w-4.5 h-4.5 text-[#25D366]" />
            <span>WhatsApp Follow-up Defaults</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#4E6259] mb-1">
                WhatsApp Sender Phone Number
              </label>
              <input
                type="text"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DCE6E2] rounded-xl text-sm font-mono-tabular text-[#142420] focus:outline-none focus:border-[#0F5C56]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4E6259] mb-1">
                Default Follow-up Delay
              </label>
              <select
                value={defaultDelay}
                onChange={(e) => setDefaultDelay(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DCE6E2] rounded-xl text-sm text-[#142420] focus:outline-none focus:border-[#0F5C56]"
              >
                <option value="3 days">3 days after visit</option>
                <option value="1 week">1 week after visit</option>
                <option value="2 weeks">2 weeks after visit</option>
                <option value="3 weeks">3 weeks after visit</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4E6259] mb-1">
                Default Follow-up Template (Urdu / English)
              </label>
              <textarea
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full h-24 p-3 bg-white border border-[#DCE6E2] rounded-xl text-sm text-[#142420] focus:outline-none focus:border-[#0F5C56]"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="text-xs text-[#1DA851] font-semibold flex items-center gap-1">
              <Check className="w-4 h-4" /> Settings Saved!
            </span>
          )}
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#0F5C56] hover:bg-[#0A413D] text-white rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-xs active:scale-95"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
