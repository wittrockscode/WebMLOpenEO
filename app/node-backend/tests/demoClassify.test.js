const request = require('supertest');
const app = require('../app');

const classify_payload = require("../demodata.json");

describe('API /api/demoClassify endpoint test', () => {
  test('POST /api/demoClassify should accept correct data and send the model id and classification results', async () => {
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
  }, 1000000);
});
