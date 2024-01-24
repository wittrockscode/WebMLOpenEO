const request = require('supertest');
const app = require('../app');

const classify_payload = require("../demodata.json");

describe('API /api/getModel endpoint test', () => {
  let server;

  beforeAll(() => {
    server = app.listen(3002); // Start the server before tests
  });
  
  afterAll(() => {
    server.close(); // Shutdown the server after tests
  });

  test('GET /api/getModel should return 404 on wrong id', async () => {
    const response = await request(app).get("/api/getModel?id=217751e2-b413-4fde-b88e-ab08b48ac7d3");
    expect(response.statusCode).toBe(404);
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', "Id not found");
  });

  test("GET /api/getModel should return a .rds file on valid id", async () => {
    const response = await request(app)
      .post('/api/demoClassify')
      .send(classify_payload)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('model_id');
    expect(response.body).toHaveProperty('classification');
    expect(response.body).toHaveProperty('class_map');

    const model = await request(app).get("/api/getModel?id=" + response.body.model_id);
    expect(model.statusCode).toBe(200);
    expect(model.headers['content-type']).toEqual(expect.stringContaining('rds'));
  }, 1000000);
});
