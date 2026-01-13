const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cluster = require('cluster');
const os = require('os');
const authRoutes = require('./routes/authRoutes');
const db = require('./config/db');

dotenv.config();
const app = express();
app.use(express.json());

// Connect DB
db.connect();

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3001;

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  app.listen(PORT, () => console.log(`Auth service running on port ${PORT} (PID: ${process.pid})`));
}