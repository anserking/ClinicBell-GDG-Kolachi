import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || '';

if (!connectionString) {
  console.warn('[ClinicBell DB] WARNING: DATABASE_URL is not configured in environment variables.');
}

export const pool = new Pool({
  connectionString,
  ssl: connectionString.includes('sslmode=') || connectionString.includes('neon.tech') ? { rejectUnauthorized: false } : undefined
});

// Helper to initialize database schema & tables automatically
export async function initializeDatabase() {
  try {
    const client = await pool.connect();
    console.log('[ClinicBell DB] Successfully connected to Neon Cloud PostgreSQL.');

    // Create Tables if not exist
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

    // Insert Default GDGDemo Hospital if not exists
    await client.query(`
      INSERT INTO hospitals (id, name, code)
      VALUES ('hosp-gdg-01', 'GDGDemo Hospital — Al-Noor Clinic', 'GDGDemo')
      ON CONFLICT (id) DO NOTHING;
    `);

    client.release();
    console.log('[ClinicBell DB] Database tables & GDGDemo Hospital node initialized.');
  } catch (err) {
    console.error('[ClinicBell DB] Error connecting to PostgreSQL:', err);
  }
}
