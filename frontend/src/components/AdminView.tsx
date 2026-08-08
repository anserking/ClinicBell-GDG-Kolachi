import React, { useState } from 'react';
import { DoctorRecord, CustomerRecord, AdminTab } from '../types';
import {
  ShieldCheck,
  Stethoscope,
  Users,
  UserPlus,
  Phone,
  Key,
  CheckCircle,
  MessageSquare,
  Sparkles,
  Search,
  Building2
} from 'lucide-react';

interface AdminViewProps {
  doctors: DoctorRecord[];
  customers: CustomerRecord[];
  onAddDoctor: (doctor: Omit<DoctorRecord, 'id' | 'registeredAt'>, password: string) => void;
  onAddCustomer: (customer: Omit<CustomerRecord, 'id' | 'registeredAt'>, password: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  doctors,
  customers,
  onAddDoctor,
  onAddCustomer
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('doctors');
  const [searchQuery, setSearchQuery] = useState('');

  // Doctor Form State
  const [docName, setDocName] = useState('');
  const [docCnic, setDocCnic] = useState('');
  const [docPhone, setDocPhone] = useState('');
  const [docPassword, setDocPassword] = useState('');
  const [docSpecialty, setDocSpecialty] = useState('General Medicine');

  // Customer Form State
  const [custName, setCustName] = useState('');
  const [custCnic, setCustCnic] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custPassword, setCustPassword] = useState('');
  const [custAge, setCustAge] = useState<number>(30);
  const [custGender, setCustGender] = useState<'Male' | 'Female' | 'Other'>('Male');

  // Notification status
  const [dispatchNotice, setDispatchNotice] = useState<string | null>(null);

  // Format CNIC as XXXXX-XXXXXXX-X automatically
  const formatCnicInput = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 13);
    if (digits.length <= 5) return digits;
    if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
  };

  const handleRegisterDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim() || !docCnic.trim() || !docPhone.trim() || !docPassword.trim()) return;

    onAddDoctor(
      {
        name: docName.trim(),
        cnic: docCnic.trim(),
        phone: docPhone.trim(),
        specialty: docSpecialty
      },
      docPassword
    );

    setDispatchNotice(
      `✅ Doctor "${docName}" registered successfully! Automated WhatsApp credentials & login details dispatched to ${docPhone}.`
    );

    // Reset form
    setDocName('');
    setDocCnic('');
    setDocPhone('');
    setDocPassword('');
    setTimeout(() => setDispatchNotice(null), 5000);
  };

  const handleRegisterCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim() || !custCnic.trim() || !custPhone.trim() || !custPassword.trim()) return;

    onAddCustomer(
      {
        name: custName.trim(),
        cnic: custCnic.trim(),
        phone: custPhone.trim(),
        age: custAge,
        gender: custGender
      },
      custPassword
    );

    setDispatchNotice(
      `✅ Customer "${custName}" registered successfully! Automated WhatsApp login details & ClinicBell PWA link dispatched to ${custPhone}.`
    );

    // Reset form
    setCustName('');
    setCustCnic('');
    setCustPhone('');
    setCustPassword('');
    setTimeout(() => setDispatchNotice(null), 5000);
  };

  const filteredDoctors = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.cnic.includes(searchQuery) ||
      d.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.cnic.includes(searchQuery) ||
      c.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6 max-w-6xl animate-fadeIn">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#0F5C56]/10 text-[#0F5C56] p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Admin Control Portal
            </span>
            <span className="text-xs text-[#7C8F87] font-mono-tabular flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" /> GDGDemo Hospital Node
            </span>
          </div>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#142420] mt-1">
            Clinic Administration
          </h1>
          <p className="text-xs text-[#7C8F87] font-mono-tabular mt-0.5">
            Register hospital medical staff, manage registered customers, and configure automated WhatsApp onboarding credentials.
          </p>
        </div>

        {/* Tab Selection Switches */}
        <div className="flex bg-[#F4F7F6] p-1.5 rounded-2xl border border-[#DCE6E2] shrink-0">
          <button
            onClick={() => setActiveTab('doctors')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'doctors'
                ? 'bg-[#0F5C56] text-white shadow-md'
                : 'text-[#4E6259] hover:text-[#142420]'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Doctors ({doctors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'customers'
                ? 'bg-[#0F5C56] text-white shadow-md'
                : 'text-[#4E6259] hover:text-[#142420]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customers ({customers.length})</span>
          </button>
        </div>
      </div>

      {/* Dispatch Success Alert Banner */}
      {dispatchNotice && (
        <div className="bg-[#E5F0EE] border border-[#B1D8D2] text-[#0A413D] p-4 rounded-2xl text-xs sm:text-sm font-medium flex items-center gap-3 animate-slideDown shadow-xs">
          <div className="w-8 h-8 rounded-full bg-[#25D366]/20 text-[#0F5C56] flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4 text-[#0F5C56]" />
          </div>
          <div className="flex-1">{dispatchNotice}</div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Registration Form */}
        <div className="lg:col-span-5 border border-[#DCE6E2] rounded-2xl p-6 bg-white shadow-2xs space-y-4">
          {activeTab === 'doctors' ? (
            <>
              <div className="flex items-center gap-2 border-b border-[#DCE6E2] pb-3">
                <div className="w-8 h-8 rounded-lg bg-[#0F5C56]/10 text-[#0F5C56] flex items-center justify-center shrink-0">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#142420]">Register New Doctor</h2>
                  <p className="text-[11px] text-[#7C8F87]">
                    Credentials will be sent automatically via WhatsApp
                  </p>
                </div>
              </div>

              <form onSubmit={handleRegisterDoctor} className="space-y-3 text-xs sm:text-sm">
                <div>
                  <label className="block font-semibold text-[#142420] mb-1">Doctor Full Name</label>
                  <input
                    type="text"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    placeholder="e.g. Dr. Ahmed Raza"
                    required
                    className="w-full p-2.5 bg-[#F4F7F6] border border-[#DCE6E2] rounded-xl text-[#142420] focus:outline-none focus:border-[#0F5C56]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#142420] mb-1">CNIC Number</label>
                  <input
                    type="text"
                    value={docCnic}
                    onChange={(e) => setDocCnic(formatCnicInput(e.target.value))}
                    placeholder="42101-1234567-1"
                    maxLength={18}
                    required
                    className="w-full p-2.5 bg-[#F4F7F6] border border-[#DCE6E2] rounded-xl font-mono-tabular text-[#142420] focus:outline-none focus:border-[#0F5C56]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#142420] mb-1">WhatsApp Phone Number</label>
                  <input
                    type="tel"
                    value={docPhone}
                    onChange={(e) => setDocPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    required
                    className="w-full p-2.5 bg-[#F4F7F6] border border-[#DCE6E2] rounded-xl font-mono-tabular text-[#142420] focus:outline-none focus:border-[#0F5C56]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#142420] mb-1">Initial Login Password</label>
                  <input
                    type="password"
                    value={docPassword}
                    onChange={(e) => setDocPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full p-2.5 bg-[#F4F7F6] border border-[#DCE6E2] rounded-xl text-[#142420] focus:outline-none focus:border-[#0F5C56]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#142420] mb-1">Medical Specialty</label>
                  <select
                    value={docSpecialty}
                    onChange={(e) => setDocSpecialty(e.target.value)}
                    className="w-full p-2.5 bg-[#F4F7F6] border border-[#DCE6E2] rounded-xl text-[#142420] focus:outline-none focus:border-[#0F5C56]"
                  >
                    <option value="General Medicine">General Medicine</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Pulmonology">Pulmonology</option>
                    <option value="ENT Specialist">ENT Specialist</option>
                    <option value="Dermatology">Dermatology</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 bg-[#0F5C56] hover:bg-[#0A413D] text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register Doctor &amp; Dispatch WhatsApp</span>
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 border-b border-[#DCE6E2] pb-3">
                <div className="w-8 h-8 rounded-lg bg-[#0F5C56]/10 text-[#0F5C56] flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#142420]">Register New Customer</h2>
                  <p className="text-[11px] text-[#7C8F87]">
                    Login link &amp; CNIC credentials dispatched to customer phone
                  </p>
                </div>
              </div>

              <form onSubmit={handleRegisterCustomer} className="space-y-3 text-xs sm:text-sm">
                <div>
                  <label className="block font-semibold text-[#142420] mb-1">Customer Full Name</label>
                  <input
                    type="text"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    placeholder="e.g. Fatima Tariq"
                    required
                    className="w-full p-2.5 bg-[#F4F7F6] border border-[#DCE6E2] rounded-xl text-[#142420] focus:outline-none focus:border-[#0F5C56]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#142420] mb-1">CNIC Number</label>
                  <input
                    type="text"
                    value={custCnic}
                    onChange={(e) => setCustCnic(formatCnicInput(e.target.value))}
                    placeholder="42101-9876543-2"
                    maxLength={18}
                    required
                    className="w-full p-2.5 bg-[#F4F7F6] border border-[#DCE6E2] rounded-xl font-mono-tabular text-[#142420] focus:outline-none focus:border-[#0F5C56]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#142420] mb-1">WhatsApp Phone Number</label>
                  <input
                    type="tel"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    placeholder="+92 321 9876543"
                    required
                    className="w-full p-2.5 bg-[#F4F7F6] border border-[#DCE6E2] rounded-xl font-mono-tabular text-[#142420] focus:outline-none focus:border-[#0F5C56]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#142420] mb-1">Initial Login Password</label>
                  <input
                    type="password"
                    value={custPassword}
                    onChange={(e) => setCustPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full p-2.5 bg-[#F4F7F6] border border-[#DCE6E2] rounded-xl text-[#142420] focus:outline-none focus:border-[#0F5C56]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#142420] mb-1">Age</label>
                    <input
                      type="number"
                      value={custAge}
                      onChange={(e) => setCustAge(Number(e.target.value))}
                      min={1}
                      max={120}
                      required
                      className="w-full p-2.5 bg-[#F4F7F6] border border-[#DCE6E2] rounded-xl font-mono-tabular text-[#142420] focus:outline-none focus:border-[#0F5C56]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#142420] mb-1">Gender</label>
                    <select
                      value={custGender}
                      onChange={(e) => setCustGender(e.target.value as any)}
                      className="w-full p-2.5 bg-[#F4F7F6] border border-[#DCE6E2] rounded-xl text-[#142420] focus:outline-none focus:border-[#0F5C56]"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 bg-[#0F5C56] hover:bg-[#0A413D] text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register Customer &amp; Send WhatsApp Link</span>
                </button>
              </form>
            </>
          )}
        </div>

        {/* Right Column: List Table / Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between gap-3 bg-white border border-[#DCE6E2] p-3 rounded-2xl shadow-2xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#7C8F87] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeTab === 'doctors'
                    ? 'Search doctors by name, CNIC, specialty...'
                    : 'Search customers by name, CNIC, phone...'
                }
                className="w-full pl-9 pr-3 py-2 bg-[#F4F7F6] border border-[#DCE6E2] rounded-xl text-xs sm:text-sm text-[#142420] focus:outline-none focus:border-[#0F5C56]"
              />
            </div>
          </div>

          {activeTab === 'doctors' ? (
            <div className="space-y-3">
              {filteredDoctors.length === 0 ? (
                <div className="bg-white border border-[#DCE6E2] rounded-2xl p-8 text-center text-[#7C8F87] text-xs">
                  No doctors registered yet. Fill out the registration form to add medical staff.
                </div>
              ) : (
                filteredDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white border border-[#DCE6E2] rounded-2xl p-4 shadow-2xs hover:border-[#0F5C56] transition-all flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F5C56] to-[#0A413D] text-white flex items-center justify-center font-bold text-sm shrink-0">
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-[#142420] flex items-center gap-2">
                          <span>{doc.name}</span>
                          <span className="bg-[#E5F0EE] text-[#0A413D] px-2 py-0.5 rounded-md text-[11px] font-mono-tabular font-medium">
                            {doc.specialty}
                          </span>
                        </div>
                        <div className="text-xs text-[#7C8F87] font-mono-tabular mt-0.5 flex items-center gap-3">
                          <span>CNIC: {doc.cnic}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1 text-[#0F5C56]">
                            <Phone className="w-3 h-3" /> {doc.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-[11px] text-[#7C8F87] font-mono-tabular shrink-0">
                      <span className="inline-flex items-center gap-1 bg-[#25D366]/10 text-[#0F5C56] px-2.5 py-1 rounded-full font-semibold">
                        <CheckCircle className="w-3 h-3 text-[#25D366]" /> Credentials Sent
                      </span>
                      <div className="mt-1">{doc.registeredAt}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCustomers.length === 0 ? (
                <div className="bg-white border border-[#DCE6E2] rounded-2xl p-8 text-center text-[#7C8F87] text-xs">
                  No customers registered yet. Fill out the registration form to add customers.
                </div>
              ) : (
                filteredCustomers.map((cust) => (
                  <div
                    key={cust.id}
                    className="bg-white border border-[#DCE6E2] rounded-2xl p-4 shadow-2xs hover:border-[#0F5C56] transition-all flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#25D366] to-[#0F5C56] text-white flex items-center justify-center font-bold text-sm shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-[#142420] flex items-center gap-2">
                          <span>{cust.name}</span>
                          <span className="text-xs text-[#7C8F87] font-mono-tabular font-normal">
                            ({cust.age} yrs · {cust.gender})
                          </span>
                        </div>
                        <div className="text-xs text-[#7C8F87] font-mono-tabular mt-0.5 flex items-center gap-3">
                          <span>CNIC: {cust.cnic}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1 text-[#0F5C56]">
                            <Phone className="w-3 h-3" /> {cust.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-[11px] text-[#7C8F87] font-mono-tabular shrink-0">
                      <span className="inline-flex items-center gap-1 bg-[#25D366]/10 text-[#0F5C56] px-2.5 py-1 rounded-full font-semibold">
                        <MessageSquare className="w-3 h-3 text-[#25D366]" /> PWA Link Sent
                      </span>
                      <div className="mt-1">{cust.registeredAt}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
