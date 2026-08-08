import { Patient, FollowupRecord } from '../types';

export const initialPatients: Patient[] = [
  {
    id: 'P-1001',
    name: 'Sana Malik',
    phone: '+92 300 1122334',
    age: 32,
    gender: 'Female',
    status: 'due',
    note: 'Follow-up due — treated for seasonal flu on the 1st visit.',
    visitsCount: 3,
    lastVisit: '2 weeks ago',
    checkedInAt: '09:15 AM',
    checkedInDate: new Date().toISOString().split('T')[0],
    followupEnabled: true,
    followupDelay: '2 weeks',
    followupMessage: 'Assalam-o-Alaikum Sana Ji, this is Al-Noor Clinic. How is your fever and cough now? Please let us know if you need to visit Dr. Ahmed Raza again.',
    history: [
      {
        id: 'v-101',
        date: '25 Jul 2026',
        text: 'Diagnosed with seasonal flu & pharyngitis. Prescribed Panadol 500mg (1-1-1) and hydration for 3 days.',
        diagnosis: 'Seasonal Influenza',
        prescription: 'Panadol 500mg, Hydration',
        doctorName: 'Dr. Ahmed Raza'
      },
      {
        id: 'v-102',
        date: '02 Jun 2026',
        text: 'Routine BP checkup. BP 120/80 mmHg, pulse 72 bpm. Advised salt restriction.',
        diagnosis: 'Routine Health Check',
        doctorName: 'Dr. Ahmed Raza'
      }
    ]
  },
  {
    id: 'P-1002',
    name: 'Fahad Qureshi',
    phone: '+92 321 4455667',
    age: 45,
    gender: 'Male',
    status: 'new',
    note: 'First visit today — complains of lower back pain for a week after lifting heavy objects.',
    visitsCount: 1,
    lastVisit: 'Today',
    checkedInAt: '09:30 AM',
    checkedInDate: new Date().toISOString().split('T')[0],
    followupEnabled: true,
    followupDelay: '1 week',
    followupMessage: 'Assalam-o-Alaikum Fahad Sahab, how is your back pain today after taking Voltaren? Please reply if pain persists.',
    history: [
      {
        id: 'v-103',
        date: '08 Aug 2026',
        text: 'Acute lumbo-sacral strain. Lower back pain without radiation. Prescribed Voltaren gel local application + Tab Muscoril 4mg x 5 days.',
        diagnosis: 'Lumbar Muscle Strain',
        prescription: 'Voltaren Gel, Tab Muscoril 4mg',
        doctorName: 'Dr. Ahmed Raza'
      }
    ]
  },
  {
    id: 'P-1003',
    name: 'Ayesha Siddiqui',
    phone: '+92 333 9988776',
    age: 28,
    gender: 'Female',
    status: 'sent',
    note: 'Follow-up sent yesterday — awaiting reply on recovery status after typhoid treatment.',
    visitsCount: 5,
    lastVisit: '3 days ago',
    checkedInAt: '10:05 AM',
    checkedInDate: '2026-08-05',
    followupEnabled: true,
    followupDelay: '1 week',
    followupMessage: 'Assalam-o-Alaikum Ayesha, hope your fever has completely subsided and appetite returned. Reply if any weakness persists.',
    history: [
      {
        id: 'v-104',
        date: '05 Aug 2026',
        text: 'Follow-up for typhoid. Patient reports fever subsided to 98.6°F. Continued Cefixime for remaining 3 days.',
        diagnosis: 'Typhoid Fever (Improving)',
        prescription: 'Tab Cefspan 400mg',
        doctorName: 'Dr. Ahmed Raza'
      },
      {
        id: 'v-105',
        date: '22 Jul 2026',
        text: 'High grade fever 102°F with abdominal cramps. Typhidot Test positive. Initiated oral antibiotic regimen.',
        diagnosis: 'Acute Typhoid Fever',
        prescription: 'Tab Cefspan 400mg OD, Syrup ORS',
        doctorName: 'Dr. Ahmed Raza'
      }
    ]
  },
  {
    id: 'P-1004',
    name: 'Bilal Hussain',
    phone: '+92 345 1237890',
    age: 52,
    gender: 'Male',
    status: 'new',
    note: 'Persistent cough for 10 days, smoker history. Checked in for chest examination.',
    visitsCount: 2,
    lastVisit: 'Today',
    checkedInAt: '10:40 AM',
    checkedInDate: new Date().toISOString().split('T')[0],
    followupEnabled: true,
    followupDelay: '1 week',
    followupMessage: 'Assalam-o-Alaikum Bilal Sahab, please share your chest X-ray report as soon as received. Regards, Al-Noor Clinic.',
    history: [
      {
        id: 'v-106',
        date: '08 Aug 2026',
        text: 'Persistent dry cough x 10 days. Auscultation: clear lungs, mild bronchospasm. Referred for Chest X-ray PA view. Prescribed Syrup Hydryllin.',
        diagnosis: 'Acute Bronchitis',
        prescription: 'Syr Hydryllin 2 tsp t.i.d, Chest X-ray PA',
        doctorName: 'Dr. Ahmed Raza'
      }
    ]
  },
  {
    id: 'P-1005',
    name: 'Hina Yousuf',
    phone: '+92 312 6547890',
    age: 26,
    gender: 'Female',
    status: 'due',
    note: 'Post-natal checkup follow-up window closing this week.',
    visitsCount: 4,
    lastVisit: '2 weeks ago',
    checkedInAt: '11:10 AM',
    checkedInDate: '2026-07-25',
    followupEnabled: true,
    followupDelay: '2 weeks',
    followupMessage: 'Assalam-o-Alaikum Hina Baji, this is Al-Noor Clinic. Are you taking your iron and calcium tablets regularly? Reply if you feel dizzy.',
    history: [
      {
        id: 'v-107',
        date: '25 Jul 2026',
        text: '6-week post-natal routine checkup. Mild fatigue reported. Hb 10.2 g/dL. Prescribed Fefol-Vit capsules b.i.d.',
        diagnosis: 'Postpartum Anemia',
        prescription: 'Cap Fefol-Vit 1-0-1',
        doctorName: 'Dr. Ahmed Raza'
      }
    ]
  },
  {
    id: 'P-1006',
    name: 'Usman Tariq',
    phone: '+92 301 7896541',
    age: 38,
    gender: 'Male',
    status: 'new',
    note: 'Mild fever and body ache since last night, first-time patient.',
    visitsCount: 1,
    lastVisit: 'Today',
    checkedInAt: '11:35 AM',
    checkedInDate: new Date().toISOString().split('T')[0],
    followupEnabled: true,
    followupDelay: '3 days',
    followupMessage: 'Assalam-o-Alaikum Usman Sahab, how is your fever now? Hope Panadol helped with the body ache.',
    history: [
      {
        id: 'v-108',
        date: '08 Aug 2026',
        text: 'Acute viral syndrome. Temp 99.8°F. Prescribed Panadol Extra 1-1-1 and hydration.',
        diagnosis: 'Viral Pyrexia',
        prescription: 'Tab Panadol Extra 2 tabs t.i.d.',
        doctorName: 'Dr. Ahmed Raza'
      }
    ]
  }
];

export const initialFollowups: FollowupRecord[] = [
  {
    id: 'F-2001',
    patientId: 'P-1001',
    patientName: 'Sana Malik',
    phone: '+92 300 1122334',
    diagnosisSummary: 'Seasonal Influenza & Pharyngitis',
    sendDate: 'Today (Due)',
    status: 'due',
    delay: '2 weeks',
    customMessage: 'Assalam-o-Alaikum Sana Ji, this is Al-Noor Clinic. How is your fever and cough now? Please let us know if you need to visit Dr. Ahmed Raza again.'
  },
  {
    id: 'F-2002',
    patientId: 'P-1005',
    patientName: 'Hina Yousuf',
    phone: '+92 312 6547890',
    diagnosisSummary: 'Postpartum Anemia & Fatigue',
    sendDate: 'Tomorrow',
    status: 'due',
    delay: '2 weeks',
    customMessage: 'Assalam-o-Alaikum Hina Baji, this is Al-Noor Clinic. Are you taking your iron and calcium tablets regularly? Reply if you feel dizzy.'
  },
  {
    id: 'F-2003',
    patientId: 'P-1003',
    patientName: 'Ayesha Siddiqui',
    phone: '+92 333 9988776',
    diagnosisSummary: 'Typhoid Fever Follow-up',
    sendDate: 'Yesterday',
    status: 'sent',
    delay: '1 week',
    customMessage: 'Assalam-o-Alaikum Ayesha, hope your fever has completely subsided and appetite returned. Reply if any weakness persists.'
  },
  {
    id: 'F-2004',
    patientId: 'P-1002',
    patientName: 'Fahad Qureshi',
    phone: '+92 321 4455667',
    diagnosisSummary: 'Lumbar Muscle Strain',
    sendDate: '15 Aug 2026',
    status: 'scheduled',
    delay: '1 week',
    customMessage: 'Assalam-o-Alaikum Fahad Sahab, how is your back pain today after taking Voltaren? Please reply if pain persists.'
  }
];
