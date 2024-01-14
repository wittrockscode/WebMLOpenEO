const request = require('supertest');
const app = require('../app');

describe('API /api endpoint test', () => {
  test('GET /api should return API documentation', async () => {
    const response = await request(app).get('/api');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('openapi');
    expect(response.body).toHaveProperty('info.title', "WebMLOpenEO-API");
  });
});
