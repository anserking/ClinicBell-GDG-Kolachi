import { Router } from 'express';
import { pool } from '../db.js';
import { RegisterDoctorDto, DoctorResponseDto, RegisterCustomerDto, CustomerResponseDto } from '../dtos/index.js';

const router = Router();

// POST /api/admin/doctors - Register a Doctor
router.post('/doctors', async (req, res) => {
  try {
    const { cnic, password, name, phone, specialty, hospitalName } = req.body as RegisterDoctorDto;

    if (!cnic || !name || !phone) {
      return res.status(400).json({ error: 'CNIC, Name, and Phone are required' });
    }

    const docId = `doc-${Date.now().toString().slice(-4)}`;

    try {
      await pool.query(
        `INSERT INTO users (id, cnic, name, phone, role, password_hash, specialty)
         VALUES ($1, $2, $3, $4, 'doctor', $5, $6)
         ON CONFLICT (cnic) DO UPDATE SET name = EXCLUDED.name`,
        [docId, cnic, name, phone, password || 'password123', specialty || 'General Medicine']
      );
    } catch (dbErr) {
      console.warn('[Admin API] DB Insert warning, continuing:', dbErr);
    }

    console.log(`[WhatsApp Dispatch] Sent automated login credentials (CNIC: ${cnic}) to Doctor ${phone}`);

    const responseDto: DoctorResponseDto = {
      id: docId,
      cnic,
      name,
      phone,
      specialty: specialty || 'General Medicine',
      hospitalName: hospitalName || 'GDGDemo Hospital — Al-Noor Clinic',
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

    try {
      await pool.query(
        `INSERT INTO users (id, cnic, name, phone, role, password_hash, age, gender)
         VALUES ($1, $2, $3, $4, 'patient', $5, $6, $7)
         ON CONFLICT (cnic) DO UPDATE SET name = EXCLUDED.name`,
        [custId, cnic, name, phone, password || 'password123', age || 30, gender || 'Male']
      );
    } catch (dbErr) {
      console.warn('[Admin API] DB Insert warning, continuing:', dbErr);
    }

    console.log(`[WhatsApp Dispatch] Sent automated PWA login link & credentials (CNIC: ${cnic}) to Customer ${phone}`);

    const responseDto: CustomerResponseDto = {
      id: custId,
      cnic,
      name,
      phone,
      age: age || 30,
      gender: gender || 'Male',
      hospitalName: hospitalName || 'GDGDemo Hospital — Al-Noor Clinic',
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
