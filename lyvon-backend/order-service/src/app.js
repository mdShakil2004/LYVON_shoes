const express = require('express');
const dotenv = require('dotenv');
const cluster = require('cluster');
const os = require('os');
const db = require('./config/db');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();
const app = express();
app.use(express.json());

db.connect();

app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 3003;

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) cluster.fork();
} else {
  app.listen(PORT, () => console.log(`Order service running on port ${PORT}`));
}

module.exports = app;