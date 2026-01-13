const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const Product = require('../src/models/productModel');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lyvon_test');
});
afterAll(async () => await mongoose.disconnect());

describe('Product API', () => {
  it('should return products with filters', async () => {
    const res = await request(app).get('/api/catalog?category=men');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});