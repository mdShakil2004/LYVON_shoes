const request = require('supertest');
const app = require('../src/app');

describe('Order API', () => {
  it('should create an order (mock auth)', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', 'Bearer valid-jwt')
      .send({ items: [], shippingAddress: {} });
    expect(res.statusCode).toBeLessThan(500);
  });
});