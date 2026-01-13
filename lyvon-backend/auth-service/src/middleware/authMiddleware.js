const jwt = require('jsonwebtoken');
const redis = require('ioredis');
const client = new redis(process.env.REDIS_URL);

module.exports = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    // Check cache first
    const cached = await client.get(`token:${jwt.decode(token).userId}`);
    if (cached !== token) throw new Error();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};