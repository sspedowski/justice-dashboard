// Login endpoint for Vercel
const jwt = require('jsonwebtoken');

module.exports = function handler(req, res) {
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

  const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret-change-me";
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "adminpass";

  const { username, password } = req.body || {};
  
  if (!username || !password) {
    return res.status(400).json({ success: false, error: "Username and password required" });
  }
  
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ sub: username, role: "admin" }, JWT_SECRET, { expiresIn: "1d" });
    return res.json({ success: true, user: { username, role: "admin" }, token });
  }
  
  return res.status(401).json({ success: false, error: "Invalid credentials" });
}