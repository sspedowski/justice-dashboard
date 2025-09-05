// Summarize endpoint for Vercel (basic version without file upload)
import jwt from 'jsonwebtoken';

function requireAuth(req, res) {
  const auth = req.headers["authorization"] || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return { error: "Missing token", status: 401 };
  
  try {
    const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret-change-me";
    const user = jwt.verify(token, JWT_SECRET);
    return { user };
  } catch {
    return { error: "Invalid token", status: 401 };
  }
}

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Check authentication
  const authResult = requireAuth(req, res);
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error });
  }

  // For now, return a basic summary response
  // In a real deployment, you'd need to handle file uploads properly
  const summary = "This is a demo summary. File upload functionality requires additional Vercel configuration for serverless functions.";
  const fileURL = "/demo-file.pdf";
  
  return res.status(201).json({ 
    summary, 
    fileURL,
    fileName: "demo.pdf",
    note: "File upload requires additional serverless function configuration" 
  });
}