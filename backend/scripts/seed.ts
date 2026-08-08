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

    console.log('[Seed Script] Seeding GDGDemo Hospital...');
    await client.query(`
      INSERT INTO hospitals (id, name, code)
      VALUES ('hosp-gdg-01', 'GDGDemo Hospital — Al-Noor Clinic', 'GDGDemo')
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
    `);

    console.log('[Seed Script] Seeding User Accounts (Doctor, Customer/Patient, Admin)...');
    // Doctor
    await client.query(`
      INSERT INTO users (id, cnic, name, phone, role, hospital_id, password_hash, specialty)
      VALUES ('u-doc-001', '42101-1234567-1', 'Dr. Ahmed Raza', '+92 300 1234567', 'doctor', 'hosp-gdg-01', 'password123', 'General Medicine')
      ON CONFLICT (cnic) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash;
    `);

    // Patient User
    await client.query(`
      INSERT INTO users (id, cnic, name, phone, role, hospital_id, password_hash, age, gender)
      VALUES ('u-cust-001', '42101-9876543-2', 'Fatima Tariq', '+92 321 9876543', 'patient', 'hosp-gdg-01', 'password123', 28, 'Female')
      ON CONFLICT (cnic) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash;
    `);

    // Admin User
    await client.query(`
      INSERT INTO users (id, cnic, name, phone, role, hospital_id, password_hash)
      VALUES ('u-admin-001', '42101-0000000-0', 'Hospital Administrator', '+92 300 0000000', 'admin', 'hosp-gdg-01', 'password123')
      ON CONFLICT (cnic) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash;
    `);

    console.log('[Seed Script] Seeding Patient Records...');
    await client.query(`
      INSERT INTO patients (id, user_id, hospital_id, cnic, name, phone, age, gender, status, note)
      VALUES ('p-001', 'u-cust-001', 'hosp-gdg-01', '42101-9876543-2', 'Fatima Tariq', '+92 321 9876543', 28, 'Female', 'due', 'Complaining of persistent dry cough and mild fever.')
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
    `);

    console.log('[Seed Script] Seeding Medical Visits...');
    await client.query(`
      INSERT INTO visits (id, patient_id, doctor_id, diagnosis, prescription, raw_note, visit_date)
      VALUES (
        'v-001',
        'p-001',
        'u-doc-001',
        'Acute Bronchitis & Viral Upper Respiratory Tract Infection',
        '1. Tab Paracetamol 500mg (1-1-1) after meals\n2. Syrup Hydryllin 2 tsp thrice daily\n3. Steam inhalation twice daily',
        'Patient visited with cough and fever. Prescribed paracetamol and hydryllin syrup.',
        'Today'
      )
      ON CONFLICT (id) DO NOTHING;
    `);

    console.log('[Seed Script] Seeding Followup Schedule...');
    await client.query(`
      INSERT INTO followups (id, patient_id, visit_id, hospital_id, send_date, status, delay, custom_message)
      VALUES (
        'f-001',
        'p-001',
        'v-001',
        'hosp-gdg-01',
        'In 2 weeks',
        'due',
        '2 weeks',
        'Assalam-o-Alaikum Fatima Tariq, this is Al-Noor Clinic following up on your visit. How are you feeling today?'
      )
      ON CONFLICT (id) DO NOTHING;
    `);

    console.log('✅ [Seed Script] SUCCESS! Neon Cloud PostgreSQL populated with mock data.');
  } catch (err) {
    console.error('❌ [Seed Script] Error during database seeding:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

runSeed();
