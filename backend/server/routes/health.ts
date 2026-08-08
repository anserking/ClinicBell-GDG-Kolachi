import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ClinicBell API',
    time: new Date().toISOString()
  });
});

export default router;
