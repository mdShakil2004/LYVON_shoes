const request = require('supertest');
const app = require('../src/app');  // Adjust import

describe('Auth API', () => {
  it('should signup a user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(res.statusCode).toEqual(201);
  });
});