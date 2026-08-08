import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { LoginRequestDto, LoginResponseDto } from '../dtos/index.js';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'clinicbell-secret-key-24h';

// POST /api/auth/login-cnic
router.post('/login-cnic', async (req, res) => {
  try {
    const { cnic, password, hospitalName, role } = req.body as LoginRequestDto;

    if (!cnic || !password) {
      return res.status(400).json({ error: 'CNIC and Password are required' });
    }

    // Lookup user by CNIC in Neon DB
    const result = await pool.query('SELECT * FROM users WHERE cnic = $1', [cnic]);

    // Secure authentication check (generic error to prevent CNIC/role enumeration attacks)
    const user = result.rows[0];
    const genericAuthError = 'Invalid CNIC, password, or role selected. Please check your credentials.';

    if (
      result.rows.length === 0 ||
      (user && user.password_hash && user.password_hash !== password) ||
      (user && role && user.role && user.role.toLowerCase() !== role.toLowerCase())
    ) {
      return res.status(401).json({ error: genericAuthError });
    }

    // Sign 24-Hour JWT Token
    const token = jwt.sign(
      {
        userId: user.id,
        cnic: user.cnic,
        role: user.role,
        hospitalId: user.hospital_id || 'hosp-gdg-01'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const responseDto: LoginResponseDto = {
      token,
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
