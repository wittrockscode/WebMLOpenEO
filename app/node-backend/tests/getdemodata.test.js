const request = require('supertest');
const app = require('./../app'); 

describe('API getDemodata-Endpoint', () => {
  let server;

  beforeAll(() => {
    server = app.listen(3000); // Start the server before tests
  });

  afterAll(() => {
    server.close(); // Shutdown the server after tests
  });

  test('GET /api/getDemodata should return a JSON-file', async () => {
    const response = await request(app).get('/api/getDemodata');

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.body).toBeInstanceOf(Object);
  });

  test('GET /api/getDemodata should return a JSON file which is a valid request for POST /api/demoClassify', async () => {
    const demo_response = await request(app).get('/api/getDemodata');

    expect(demo_response.statusCode).toBe(200);
    expect(demo_response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(demo_response.body).toBeInstanceOf(Object);

    const classy_response = await request(app)
      .post('/api/demoClassify')
      .send(demo_response.body)
      .set('Accept', 'application/json');

    expect(classy_response.statusCode).toBe(200);

  }, 1000000);

});
