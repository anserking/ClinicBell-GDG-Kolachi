import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// GET /api/patient-portal/me?cnic=:cnic
router.get('/me', async (req, res) => {
  try {
    const cnic = req.query.cnic as string;
    if (!cnic) {
      return res.status(400).json({ error: 'CNIC parameter is required' });
    }

    // 1. Fetch Patient Record from DB
    const patientResult = await pool.query(
      'SELECT * FROM patients WHERE cnic = $1 OR user_id IN (SELECT id FROM users WHERE cnic = $1)',
      [cnic]
    );

    if (patientResult.rows.length === 0) {
      // Return user fallback if user exists but patient profile record hasn't been created
      const userResult = await pool.query('SELECT * FROM users WHERE cnic = $1', [cnic]);
      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'Patient account not found in database.' });
      }

      const u = userResult.rows[0];
      return res.json({
        patient: {
          id: u.id,
          name: u.name,
          cnic: u.cnic,
          phone: u.phone,
          age: u.age || 30,
          gender: u.gender || 'Not Specified',
          status: 'active',
          note: 'No active clinical complaints.'
        },
        visits: [],
        followups: []
      });
    }

    const patient = patientResult.rows[0];

    // 2. Fetch Visits associated with patient, joining doctor's name
    const visitsResult = await pool.query(
      `SELECT v.id, v.diagnosis, v.prescription, v.raw_note as "rawNote", v.visit_date as "date", u.name as "doctorName"
       FROM visits v
       LEFT JOIN users u ON v.doctor_id = u.id
       WHERE v.patient_id = $1
       ORDER BY v.created_at DESC`,
      [patient.id]
    );

    // 3. Fetch Followup Reminders for patient
    const followupsResult = await pool.query(
      `SELECT id, send_date as "sendDate", status, delay, custom_message as "customMessage", scheduled_at as "scheduledAt"
       FROM followups
       WHERE patient_id = $1
       ORDER BY scheduled_at DESC`,
      [patient.id]
    );

    return res.json({
      patient: {
        id: patient.id,
        name: patient.name,
        cnic: patient.cnic,
        phone: patient.phone,
        age: patient.age || 30,
        gender: patient.gender || 'Not Specified',
        status: patient.status || 'active',
        note: patient.note || ''
      },
      visits: visitsResult.rows,
      followups: followupsResult.rows
    });
  } catch (err: any) {
    console.error('[Patient Portal API] Error fetching patient records:', err);
    return res.status(500).json({ error: 'Failed to retrieve patient portal data', details: err?.message });
  }
});

export default router;
