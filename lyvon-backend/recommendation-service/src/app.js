const express = require('express');
const dotenv = require('dotenv');
const cluster = require('cluster');
const os = require('os');
const db = require('./config/db');
const recommendationRoutes = require('./routes/recommendationRoutes');

dotenv.config();
const app = express();
app.use(express.json());

db.connect();

app.use('/api/recommendations', recommendationRoutes);

const PORT = process.env.PORT || 3004;

if (cluster.isMaster) {
  for (let i = 0; i < os.cpus().length; i++) cluster.fork();
} else {
  app.listen(PORT, () => console.log(`Recommendation service on port ${PORT}`));
}