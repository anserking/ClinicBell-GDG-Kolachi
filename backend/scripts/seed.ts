import pg from 'pg';

const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_W5pKDlqQ1GjR@ep-dark-shadow-ax2anau5-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function runSeed() {
  console.log('[Seed Script] Connecting to Neon Cloud PostgreSQL database...');
  const client = await pool.connect();

  try {
    console.log('[Seed Script] Creating tables if not exist...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS hospitals (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(50) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        cnic VARCHAR(20) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        role VARCHAR(20) NOT NULL,
        hospital_id VARCHAR(50) REFERENCES hospitals(id),
        password_hash VARCHAR(255) NOT NULL,
        specialty VARCHAR(100),
        age INT,
        gender VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS patients (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) REFERENCES users(id),
        hospital_id VARCHAR(50) REFERENCES hospitals(id),
        cnic VARCHAR(20) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        age INT,
        gender VARCHAR(20),
        status VARCHAR(20) DEFAULT 'new',
        note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS visits (
        id VARCHAR(50) PRIMARY KEY,
        patient_id VARCHAR(50) REFERENCES patients(id),
        doctor_id VARCHAR(50) REFERENCES users(id),
        diagnosis TEXT,
        prescription TEXT,
        raw_note TEXT,
        visit_date VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS followups (
        id VARCHAR(50) PRIMARY KEY,
        patient_id VARCHAR(50) REFERENCES patients(id),
        visit_id VARCHAR(50) REFERENCES visits(id),
        hospital_id VARCHAR(50) REFERENCES hospitals(id),
        send_date VARCHAR(50),
        status VARCHAR(20) DEFAULT 'scheduled',
        delay VARCHAR(50),
        custom_message TEXT,
        scheduled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('[Seed Script] Seeding Primary Hospital Node (hosp-gdg-01)...');
    await client.query(`
      INSERT INTO hospitals (id, name, code)
      VALUES ('hosp-gdg-01', 'GDGDemo Hospital', 'GDGDemo')
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
    `);

    console.log('[Seed Script] Seeding User Accounts (3 Doctors, 1 Admin, 5 Customers)...');

    // Admin User
    await client.query(`
      INSERT INTO users (id, cnic, name, phone, role, hospital_id, password_hash)
      VALUES ('u-admin-001', '42101-0000000-0', 'Hospital Administrator', '+92 300 0000000', 'admin', 'hosp-gdg-01', 'password123')
      ON CONFLICT (cnic) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash;
    `);

    // Doctor 1: Dr. Ahmed Raza
    await client.query(`
      INSERT INTO users (id, cnic, name, phone, role, hospital_id, password_hash, specialty)
      VALUES ('u-doc-001', '42101-1234567-1', 'Dr. Ahmed Raza', '+92 300 1234567', 'doctor', 'hosp-gdg-01', 'password123', 'General Medicine')
      ON CONFLICT (cnic) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, specialty = EXCLUDED.specialty;
    `);

    // Doctor 2: Dr. Sara Khan
    await client.query(`
      INSERT INTO users (id, cnic, name, phone, role, hospital_id, password_hash, specialty)
      VALUES ('u-doc-002', '42101-2345678-2', 'Dr. Sara Khan', '+92 300 9876543', 'doctor', 'hosp-gdg-01', 'password123', 'Pediatrics')
      ON CONFLICT (cnic) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, specialty = EXCLUDED.specialty;
    `);

    // Doctor 3: Dr. Bilal Mansoor
    await client.query(`
      INSERT INTO users (id, cnic, name, phone, role, hospital_id, password_hash, specialty)
      VALUES ('u-doc-003', '42101-3456789-3', 'Dr. Bilal Mansoor', '+92 301 5554321', 'doctor', 'hosp-gdg-01', 'password123', 'Cardiology')
      ON CONFLICT (cnic) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, specialty = EXCLUDED.specialty;
    `);

    // Customer 1: Fatima Tariq
    await client.query(`
      INSERT INTO users (id, cnic, name, phone, role, hospital_id, password_hash, age, gender)
      VALUES ('u-cust-001', '42101-9876543-2', 'Fatima Tariq', '+92 321 9876543', 'patient', 'hosp-gdg-01', 'password123', 28, 'Female')
      ON CONFLICT (cnic) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, age = EXCLUDED.age, gender = EXCLUDED.gender;
    `);

    // Customer 2: Tariq Mehmood
    await client.query(`
      INSERT INTO users (id, cnic, name, phone, role, hospital_id, password_hash, age, gender)
      VALUES ('u-cust-002', '42101-8765432-1', 'Tariq Mehmood', '+92 333 8765432', 'patient', 'hosp-gdg-01', 'password123', 54, 'Male')
      ON CONFLICT (cnic) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, age = EXCLUDED.age, gender = EXCLUDED.gender;
    `);

    // Customer 3: Ayesha Malik
    await client.query(`
      INSERT INTO users (id, cnic, name, phone, role, hospital_id, password_hash, age, gender)
      VALUES ('u-cust-003', '42101-7654321-0', 'Ayesha Malik', '+92 345 7654321', 'patient', 'hosp-gdg-01', 'password123', 32, 'Female')
      ON CONFLICT (cnic) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, age = EXCLUDED.age, gender = EXCLUDED.gender;
    `);

    // Customer 4: Zayn Ali
    await client.query(`
      INSERT INTO users (id, cnic, name, phone, role, hospital_id, password_hash, age, gender)
      VALUES ('u-cust-004', '42101-6543210-9', 'Zayn Ali', '+92 300 6543210', 'patient', 'hosp-gdg-01', 'password123', 8, 'Male')
      ON CONFLICT (cnic) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, age = EXCLUDED.age, gender = EXCLUDED.gender;
    `);

    // Customer 5: Usman Ghani
    await client.query(`
      INSERT INTO users (id, cnic, name, phone, role, hospital_id, password_hash, age, gender)
      VALUES ('u-cust-005', '42101-5432109-8', 'Usman Ghani', '+92 312 5432109', 'patient', 'hosp-gdg-01', 'password123', 41, 'Male')
      ON CONFLICT (cnic) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, age = EXCLUDED.age, gender = EXCLUDED.gender;
    `);

    console.log('[Seed Script] Seeding Patient Medical Profiles...');
    // Patient Profiles
    await client.query(`
      INSERT INTO patients (id, user_id, hospital_id, cnic, name, phone, age, gender, status, note)
      VALUES 
        ('p-001', 'u-cust-001', 'hosp-gdg-01', '42101-9876543-2', 'Fatima Tariq', '+92 321 9876543', 28, 'Female', 'due', 'Complaining of dry cough, chest tightness, and mild evening fever.'),
        ('p-002', 'u-cust-002', 'hosp-gdg-01', '42101-8765432-1', 'Tariq Mehmood', '+92 333 8765432', 54, 'Male', 'sent', 'Routine hypertension monitoring and HbA1c diabetic checkup.'),
        ('p-003', 'u-cust-003', 'hosp-gdg-01', '42101-7654321-0', 'Ayesha Malik', '+92 345 7654321', 32, 'Female', 'scheduled', 'Post-natal consultation and iron deficiency anemia review.'),
        ('p-004', 'u-cust-004', 'hosp-gdg-01', '42101-6543210-9', 'Zayn Ali', '+92 300 6543210', 8, 'Male', 'new', 'Recurrent nocturnal wheezing and seasonal allergy symptoms.'),
        ('p-005', 'u-cust-005', 'hosp-gdg-01', '42101-5432109-8', 'Usman Ghani', '+92 312 5432109', 41, 'Male', 'due', 'Exertional chest discomfort and lipid panel evaluation.')
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, note = EXCLUDED.note;
    `);

    console.log('[Seed Script] Seeding Medical Visits & Prescriptions...');
    await client.query(`
      INSERT INTO visits (id, patient_id, doctor_id, diagnosis, prescription, raw_note, visit_date)
      VALUES 
        (
          'v-001',
          'p-001',
          'u-doc-001',
          'Acute Bronchitis & Upper Respiratory Tract Infection',
          '1. Tab Paracetamol 500mg (1-1-1) after meals\n2. Syrup Hydryllin 2 tsp thrice daily\n3. Cap Amoxicillin 500mg (1-0-1) for 5 days',
          'Patient presented with cough and low-grade fever. Lungs clear with mild rhonchi.',
          'Yesterday'
        ),
        (
          'v-002',
          'p-001',
          'u-doc-001',
          'Seasonal Allergic Rhinitis Follow-up',
          '1. Tab Cetirizine 10mg (0-0-1) at bedtime\n2. Fluticasone Nasal Spray 1 puff each nostril daily',
          'Fever resolved. Mild residual congestion remaining.',
          '3 weeks ago'
        ),
        (
          'v-003',
          'p-002',
          'u-doc-003',
          'Essential Hypertension & Type 2 Diabetes Mellitus',
          '1. Tab Softvas 5mg (1-0-0) morning\n2. Tab Glucophage 500mg (1-0-1) after meals\n3. Low sodium diabetic diet recommended',
          'BP: 145/90 mmHg. Fasting blood glucose: 138 mg/dL. Adjusted medication dosage.',
          'Today'
        ),
        (
          'v-004',
          'p-003',
          'u-doc-001',
          'Iron Deficiency Anemia & Fatigue',
          '1. Cap Fefol (Iron + Folic Acid) (1-0-0) after breakfast\n2. Tab Vitamin C 500mg (1-0-0)',
          'Hb level: 9.8 g/dL. Prescribed hematinic supplements.',
          '5 days ago'
        ),
        (
          'v-005',
          'p-004',
          'u-doc-002',
          'Pediatric Bronchial Asthma & Allergic Cough',
          '1. Ventolin Inhaler 100mcg (2 puffs PRN)\n2. Syp Montelukast 4mg (0-0-1) daily',
          'Pediatric visit. Chest wheeze on exhalation. Started inhaled bronchodilator therapy.',
          '2 days ago'
        ),
        (
          'v-006',
          'p-005',
          'u-doc-003',
          'Dyslipidemia & Mild Exertional Angina Risk',
          '1. Tab Lipiget 20mg (0-0-1) at night\n2. Tab Loprin 75mg (1-0-0) daily\n3. ECG & Echocardiogram advised',
          'Elevated LDL cholesterol (165 mg/dL). Initiated statin therapy.',
          'Today'
        )
      ON CONFLICT (id) DO NOTHING;
    `);

    console.log('[Seed Script] Seeding WhatsApp Follow-up Schedule & Log...');
    await client.query(`
      INSERT INTO followups (id, patient_id, visit_id, hospital_id, send_date, status, delay, custom_message)
      VALUES 
        (
          'f-001',
          'p-001',
          'v-001',
          'hosp-gdg-01',
          'In 1 week',
          'due',
          '1 week',
          'Assalam-o-Alaikum Fatima Tariq, Dr. Ahmed Raza from GDGDemo Hospital following up on your visit. How is your cough today?'
        ),
        (
          'f-002',
          'p-002',
          'v-003',
          'hosp-gdg-01',
          'In 2 weeks',
          'sent',
          '2 weeks',
          'Assalam-o-Alaikum Tariq Mehmood, checking in regarding your blood pressure readings. Please remember to record your morning BP.'
        ),
        (
          'f-003',
          'p-003',
          'v-004',
          'hosp-gdg-01',
          'In 3 weeks',
          'scheduled',
          '3 weeks',
          'Assalam-o-Alaikum Ayesha Malik, reminder for your upcoming repeat hemoglobin blood test at GDGDemo Hospital.'
        ),
        (
          'f-004',
          'p-004',
          'v-005',
          'hosp-gdg-01',
          'In 1 week',
          'due',
          '1 week',
          'Assalam-o-Alaikum, Dr. Sara Khan checking on Zayn Ali. Is the inhaler helping with his night cough?'
        ),
        (
          'f-005',
          'p-005',
          'v-006',
          'hosp-gdg-01',
          'In 2 weeks',
          'scheduled',
          '2 weeks',
          'Assalam-o-Alaikum Usman Ghani, reminder to collect your lipid profile and ECG report from GDGDemo Hospital lab.'
        )
      ON CONFLICT (id) DO NOTHING;
    `);

    console.log('✅ [Seed Script] SUCCESS! Neon Cloud PostgreSQL populated with rich multi-doctor, multi-customer data.');
  } catch (err) {
    console.error('❌ [Seed Script] Error during database seeding:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

runSeed();
