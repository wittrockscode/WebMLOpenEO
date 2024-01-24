const request = require('supertest');
const app = require('../app');

describe('API /api/openeocubes endpoint test', () => {
  test('GET /api/openeocubes should return openeocubes documentation', async () => {
    const response = await request(app).get('/api');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.body).toBeInstanceOf(Object);
  });
});