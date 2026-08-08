import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// GET /api/patients - Get all patient records with medical visit history from Neon DB
router.get('/', async (req, res) => {
  try {
    const patientsResult = await pool.query(
      `SELECT id, cnic, name, phone, age, gender, status, note, created_at as "createdAt"
       FROM patients
       ORDER BY created_at DESC`
    );

    const patients = patientsResult.rows;

    // Fetch visits for each patient
    const enrichedPatients = await Promise.all(
      patients.map(async (p) => {
        const visitsResult = await pool.query(
          `SELECT v.id, v.diagnosis, v.prescription, v.raw_note as "text", v.visit_date as "date", u.name as "doctorName"
           FROM visits v
           LEFT JOIN users u ON v.doctor_id = u.id
           WHERE v.patient_id = $1
           ORDER BY v.created_at DESC`,
          [p.id]
        );

        const visits = visitsResult.rows;
        const visitsCount = visits.length;
        const lastVisitDate = visits.length > 0 ? visits[0].date : 'None';

        return {
          ...p,
          visitsCount,
          lastVisit: lastVisitDate,
          history: visits
        };
      })
    );

    return res.json(enrichedPatients);
  } catch (err: any) {
    console.error('[Patients API] Error fetching patients:', err);
    return res.status(500).json({ error: 'Failed to fetch patients', details: err?.message });
  }
});

// POST /api/patients - Register a new patient in Neon DB
router.post('/', async (req, res) => {
  try {
    const { name, phone, age, gender, note, cnic } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and Phone are required' });
    }

    const pId = `p-${Date.now().toString().slice(-4)}`;
    const pCnic = cnic || `42101-${Math.floor(1000000 + Math.random() * 9000000)}-${Math.floor(1 + Math.random() * 9)}`;

    const result = await pool.query(
      `INSERT INTO patients (id, hospital_id, cnic, name, phone, age, gender, status, note)
       VALUES ($1, 'hosp-gdg-01', $2, $3, $4, $5, $6, 'new', $7)
       RETURNING *`,
      [pId, pCnic, name, phone, age || 30, gender || 'Male', note || 'Checked in at reception']
    );

    const row = result.rows[0];
    return res.json({
      id: row.id,
      cnic: row.cnic,
      name: row.name,
      phone: row.phone,
      age: row.age,
      gender: row.gender,
      status: row.status,
      note: row.note,
      visitsCount: 0,
      lastVisit: 'Today',
      history: []
    });
  } catch (err: any) {
    console.error('[Patients API] Error creating patient:', err);
    return res.status(500).json({ error: 'Failed to create patient record', details: err?.message });
  }
});

// GET /api/followups - Get all followups from Neon DB
router.get('/followups', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT f.id, f.patient_id as "patientId", f.send_date as "sendDate", f.status, f.delay, f.custom_message as "customMessage", p.name as "patientName", p.phone as "patientPhone"
       FROM followups f
       LEFT JOIN patients p ON f.patient_id = p.id
       ORDER BY f.scheduled_at DESC`
    );

    return res.json(result.rows);
  } catch (err: any) {
    console.error('[Followups API] Error fetching followups:', err);
    return res.status(500).json({ error: 'Failed to fetch followups', details: err?.message });
  }
});

export default router;
