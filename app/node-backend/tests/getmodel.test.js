const request = require('supertest');
const app = require('../app');

describe('API /api/getModel endpoint test', () => {
  test('GET /api/getModel should return 404 on wrong id', async () => {
    const response = await request(app).get("/api/getModel?id=217751e2-b413-4fde-b88e-ab08b48ac7d3");
    expect(response.statusCode).toBe(404);
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', "Id not found");
  });

  test("GET /api/getModel should return a .rds file on valid id", async () => {
    //TODO
  });
});
