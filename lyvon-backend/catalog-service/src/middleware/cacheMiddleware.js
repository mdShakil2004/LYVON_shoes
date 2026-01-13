const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

module.exports = (duration = 60) => async (req, res, next) => {
  const key = `cache:${req.originalUrl}`;
  try {
    const cached = await redis.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    res.sendResponse = res.json;
    res.json = (body) => {
      redis.set(key, JSON.stringify(body), 'EX', duration);
      res.sendResponse(body);
    };
    next();
  } catch (err) {
    console.error('Redis error:', err);
    next();
  }
};