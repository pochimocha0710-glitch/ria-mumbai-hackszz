// Vercel serverless function for API routes
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Health check endpoint
  if (req.url === '/api/health' || req.url?.endsWith('/api/health')) {
    return res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    });
  }

  // Add other API routes here as needed
  res.status(404).json({ message: 'API endpoint not found' });
}
