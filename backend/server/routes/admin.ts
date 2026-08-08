import { Router } from 'express';
import { pool } from '../db.js';
import { RegisterDoctorDto, DoctorResponseDto, RegisterCustomerDto, CustomerResponseDto } from '../dtos/index.js';

const router = Router();

// GET /api/admin/doctors - Get all registered doctors from Neon DB
router.get('/doctors', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, cnic, name, phone, specialty, created_at as "registeredAt" 
       FROM users 
       WHERE role = 'doctor' 
       ORDER BY created_at DESC`
    );
    return res.json(result.rows);
  } catch (err: any) {
    console.error('[Admin API] Get doctors error:', err);
    return res.status(500).json({ error: 'Failed to fetch doctors', details: err?.message });
  }
});

// GET /api/admin/customers - Get all registered customers from Neon DB
router.get('/customers', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, cnic, name, phone, age, gender, created_at as "registeredAt" 
       FROM users 
       WHERE role = 'patient' 
       ORDER BY created_at DESC`
    );
    return res.json(result.rows);
  } catch (err: any) {
    console.error('[Admin API] Get customers error:', err);
    return res.status(500).json({ error: 'Failed to fetch customers', details: err?.message });
  }
});

// POST /api/admin/doctors - Register a Doctor
router.post('/doctors', async (req, res) => {
  try {
    const { cnic, password, name, phone, specialty, hospitalName } = req.body as RegisterDoctorDto;

    if (!cnic || !name || !phone) {
      return res.status(400).json({ error: 'CNIC, Name, and Phone are required' });
    }

    const docId = `doc-${Date.now().toString().slice(-4)}`;

    await pool.query(
      `INSERT INTO users (id, cnic, name, phone, role, password_hash, specialty)
       VALUES ($1, $2, $3, $4, 'doctor', $5, $6)
       ON CONFLICT (cnic) DO UPDATE SET name = EXCLUDED.name, specialty = EXCLUDED.specialty`,
      [docId, cnic, name, phone, password || 'password123', specialty || 'General Medicine']
    );

    console.log(`[WhatsApp Dispatch] Sent automated login credentials (CNIC: ${cnic}) to Doctor ${phone}`);

    const responseDto: DoctorResponseDto = {
      id: docId,
      cnic,
      name,
      phone,
      specialty: specialty || 'General Medicine',
      hospitalName: hospitalName || 'GDGDemo Hospital',
      registeredAt: 'Just now',
      whatsappStatus: 'sent'
    };

    return res.json(responseDto);
  } catch (err: any) {
    console.error('[Admin API] Register doctor error:', err);
    return res.status(500).json({ error: 'Failed to register doctor', details: err?.message });
  }
});

// POST /api/admin/customers - Register a Customer / Patient
router.post('/customers', async (req, res) => {
  try {
    const { cnic, password, name, phone, age, gender, hospitalName } = req.body as RegisterCustomerDto;

    if (!cnic || !name || !phone) {
      return res.status(400).json({ error: 'CNIC, Name, and Phone are required' });
    }

    const custId = `cust-${Date.now().toString().slice(-4)}`;
    const patientId = `p-${Date.now().toString().slice(-4)}`;

    await pool.query(
      `INSERT INTO users (id, cnic, name, phone, role, password_hash, age, gender)
       VALUES ($1, $2, $3, $4, 'patient', $5, $6, $7)
       ON CONFLICT (cnic) DO UPDATE SET name = EXCLUDED.name, age = EXCLUDED.age, gender = EXCLUDED.gender`,
      [custId, cnic, name, phone, password || 'password123', age || 30, gender || 'Male']
    );

    // Also insert into patients table for clinical queue tracking
    await pool.query(
      `INSERT INTO patients (id, user_id, hospital_id, cnic, name, phone, age, gender, status, note)
       VALUES ($1, $2, 'hosp-gdg-01', $3, $4, $5, $6, $7, 'new', 'Registered customer account')
       ON CONFLICT (id) DO NOTHING`,
      [patientId, custId, cnic, name, phone, age || 30, gender || 'Male']
    );

    console.log(`[WhatsApp Dispatch] Sent automated PWA login link & credentials (CNIC: ${cnic}) to Customer ${phone}`);

    const responseDto: CustomerResponseDto = {
      id: custId,
      cnic,
      name,
      phone,
      age: age || 30,
      gender: gender || 'Male',
      hospitalName: hospitalName || 'GDGDemo Hospital',
      registeredAt: 'Just now',
      whatsappStatus: 'sent'
    };

    return res.json(responseDto);
  } catch (err: any) {
    console.error('[Admin API] Register customer error:', err);
    return res.status(500).json({ error: 'Failed to register customer', details: err?.message });
  }
});

export default router;
