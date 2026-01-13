const express = require('express');
const dotenv = require('dotenv');
const cluster = require('cluster');
const os = require('os');
const db = require('./config/db');
const productRoutes = require('./routes/productRoutes');

dotenv.config();
const app = express();
app.use(express.json());

db.connect();

app.use('/api/catalog', productRoutes);

const PORT = process.env.PORT || 3002;

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) cluster.fork();
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  app.listen(PORT, () => console.log(`Catalog service running on port ${PORT} (PID: ${process.pid})`));
}

module.exports = app;