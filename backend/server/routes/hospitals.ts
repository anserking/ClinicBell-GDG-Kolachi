import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// GET /api/hospitals - Fetch all registered hospital nodes from Neon Cloud PostgreSQL
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, code FROM hospitals ORDER BY name ASC');

    let hospitals = result.rows;
    if (hospitals.length === 0) {
      hospitals = [{ id: 'hosp-gdg-01', name: 'GDGDemo Hospital — Al-Noor Clinic', code: 'GDGDemo' }];
    }

    return res.json(hospitals);
  } catch (err: any) {
    console.error('[Hospitals API] Error fetching hospitals:', err);
    // Fallback GDGDemo hospital node
    return res.json([{ id: 'hosp-gdg-01', name: 'GDGDemo Hospital — Al-Noor Clinic', code: 'GDGDemo' }]);
  }
});

export default router;
