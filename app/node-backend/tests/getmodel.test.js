const request = require('supertest');
const app = require('../app');

describe('API /api/getmodel endpoint test', () => {
  test('GET /api/getmodel should return 404 on wrong id', async () => {
    const response = await request(app).get('/api/getmodel?id=-1');
    expect(response.statusCode).toBe(404);
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', "Id not found");
  });

  test("GET /api/getmodel should return a .rds file on valid id", async () => {
    //TODO
  });
});
