import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRouter from './server/routes/health.js';
import geminiRouter from './server/routes/gemini.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for Netlify frontend and local dev
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL || ''
].filter(Boolean);

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(null, true); // Permissive for hackathon demo
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Health and AI API Routes
app.use('/api/health', healthRouter);
app.use('/api/gemini', geminiRouter);

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ClinicBell API',
    message: 'Backend server is running cleanly.'
  });
});

app.listen(PORT, () => {
  console.log(`[ClinicBell Backend] Running on port ${PORT}`);
});
