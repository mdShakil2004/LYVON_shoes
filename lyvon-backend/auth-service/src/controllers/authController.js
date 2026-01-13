const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const redis = require('ioredis');
const client = new redis(process.env.REDIS_URL);

exports.signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Cache token (optional for session)
    await client.set(`token:${user._id}`, token, 'EX', 3600);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};