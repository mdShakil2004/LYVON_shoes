const mongoose = require('mongoose');

module.exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Recommendation MongoDB connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};