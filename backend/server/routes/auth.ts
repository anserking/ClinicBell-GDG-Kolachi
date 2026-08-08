import { Router } from 'express';
import { pool } from '../db.js';
import { LoginRequestDto, LoginResponseDto } from '../dtos/index.js';

const router = Router();

// POST /api/auth/login-cnic
router.post('/login-cnic', async (req, res) => {
  try {
    const { cnic, password, hospitalName, role } = req.body as LoginRequestDto;

    if (!cnic || !password) {
      return res.status(400).json({ error: 'CNIC and Password are required' });
    }

    // Lookup user by CNIC in Neon DB
    const result = await pool.query('SELECT * FROM users WHERE cnic = $1', [cnic]);

    let user;
    if (result.rows.length > 0) {
      user = result.rows[0];
    } else {
      // Demo fallback user object if database is initializing
      let name = 'Dr. Ahmed Raza';
      if (role === 'admin') name = 'Hospital Administrator';
      if (role === 'patient') name = 'Fatima Tariq';

      user = {
        id: `u-${Date.now().toString().slice(-4)}`,
        cnic,
        name,
        phone: '+92 300 1234567',
        role: role || 'doctor',
        hospital_id: 'hosp-gdg-01',
        specialty: 'General Medicine'
      };
    }

    const responseDto: LoginResponseDto = {
      token: `jwt-token-${Date.now()}`,
      user: {
        id: user.id,
        cnic: user.cnic,
        name: user.name,
        phone: user.phone,
        role: user.role as any,
        hospitalName: hospitalName || 'GDGDemo Hospital — Al-Noor Clinic',
        specialty: user.specialty,
        age: user.age,
        gender: user.gender
      }
    };

    return res.json(responseDto);
  } catch (err: any) {
    console.error('[Auth API] Login error:', err);
    return res.status(500).json({ error: 'Authentication failed', details: err?.message });
  }
});

export default router;
