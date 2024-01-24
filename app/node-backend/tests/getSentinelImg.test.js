const request = require('supertest');
const app = require('../app');

const sentinel_payload = {
    TOI: {
        start_date: "2022-06-01",
        end_date: "2022-06-30"
      },
    AOI: {
          geometry: {
            coordinates: [[
                [854523.1986700408, 6797063.516360302],
                [854523.1986700408, 6799315.301182906],
                [857831.1917130196, 6799315.301182906],
                [857831.1917130196, 6797063.516360302],
                [854523.1986700408, 6797063.516360302]
              ]],
              type: "Polygon"
            }
        }
  }

describe('API /api/getSentinelImg endpoint test', () => {
  test('POST /api/getSentinelImg should accept correct data and send RGB-image as tif', async () => {
    const response = await request(app)
      .post('/api/getSentinelImg')
      .send(sentinel_payload)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toEqual(expect.stringContaining('tif'));
    
  }, 1000000);
});
