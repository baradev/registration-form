import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';

const app: Express = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// Start server (always start when running this file directly)
app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
});

export default app;
