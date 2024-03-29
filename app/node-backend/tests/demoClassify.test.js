const request = require('supertest');
const app = require('../app');

const demoClassify_payload = require("../demodata.json");

describe('API /api/demoClassify endpoint test', () => {
  test('POST /api/demoClassify should accept correct data and send the model id and classification results', async () => {
    const response = await request(app)
      .post('/api/demoClassify')
      .send(demoClassify_payload)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('model_id');
    expect(response.body).toHaveProperty('classification');
    expect(response.body).toHaveProperty('class_map');
  }, 1000000);

  test('POST /api/demoClassify should decline incorrect datastructure', async () => {
    const false_demoClassify_payload = {
      "model": "RandomForest"
    };
    const response = await request(app)
      .post('/api/demoClassify')
      .send(false_demoClassify_payload)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    // OpenAPI-Validator catches big mistakes and returns 400, but OpenAPI-Validator is turned off because of uniform error-messages, so Joi returns 422
    expect(response.statusCode).toBe(422);
  });

  test('POST /api/demoClassify should decline data which isnt the same as demodata.json', async () => {
    const false_demoClassify_payload = {
      "model": "RandomForest",
      "TOI": {
        "start_date": "2022-06-01",
        "end_date": "2022-06-30"
      },
      "AOI": {
        "geometry": {
          "type": "Polygon",
          "coordinates": [[
            [854523.1986700408, 6797063.516360302],
            [854523.1986700408, 6799315.301182906],
            [857831.1917130196, 6799315.301182906],
            [857831.1917130196, 6797063.516360302],
            [854523.1986700408, 6797063.516360302]
          ]]
        }
      },
      "tot": {
        "start_date": "2022-07-01",
        "end_date": "2022-07-15"
      },
      "Training_Data": {
        "type": "FeatureCollection",
        "name": "demo_training_data",
        "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
        "features": [
        { "type": "Feature", "properties": { "class": "Wald" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 7.689557844550476, 51.949452468942482 ], [ 7.688892820575198, 51.949026810046234 ], [ 7.688995131956011, 51.947686746399938 ], [ 7.690990203881843, 51.948601147109812 ], [ 7.693778189008965, 51.948616912475792 ], [ 7.695517482482767, 51.949956948328605 ], [ 7.695645371708782, 51.950319539382036 ], [ 7.694443212984243, 51.951013183663179 ], [ 7.696003461541622, 51.951943280746399 ], [ 7.695798838779998, 51.952305855739226 ], [ 7.694340901603431, 51.952274327595376 ], [ 7.692499296748817, 51.950792479828458 ], [ 7.693113165033688, 51.950256480278995 ], [ 7.692192362606382, 51.949673179372205 ], [ 7.689660155931289, 51.949531294220662 ], [ 7.689557844550476, 51.949452468942482 ] ] ] } },
        { "type": "Feature", "properties": { "class": "Versiegelt" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 7.670323304957849, 51.952810303026297 ], [ 7.670323304957849, 51.951517645492274 ], [ 7.67784319144752, 51.949279052842826 ], [ 7.679787107682945, 51.952904886260846 ], [ 7.670323304957849, 51.952810303026297 ] ] ] } },
        { "type": "Feature", "properties": { "class": "Feld" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 7.689212543640235, 51.95613636025216 ], [ 7.688266163367726, 51.954575823841481 ], [ 7.693023642575478, 51.952400440037813 ], [ 7.693611933015146, 51.95279453913448 ], [ 7.692205151528981, 51.954055632967936 ], [ 7.690619325126397, 51.954292084113142 ], [ 7.690082190377137, 51.954828035425976 ], [ 7.691156459875661, 51.956152122969122 ], [ 7.689212543640235, 51.95613636025216 ] ] ] } },
        { "type": "Feature", "properties": { "class": "Acker" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 7.697320720569576, 51.952416204068179 ], [ 7.695402382179351, 51.951092006198067 ], [ 7.697013786427139, 51.949752004262422 ], [ 7.697397454105184, 51.949893888715664 ], [ 7.697320720569576, 51.952416204068179 ] ] ] } },
        { "type": "Feature", "properties": { "class": "Acker" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 7.680976477484883, 51.949846593947818 ], [ 7.681002055330085, 51.948947983881332 ], [ 7.683099438636728, 51.948884922849665 ], [ 7.6837133069216, 51.949310583092625 ], [ 7.683687729076395, 51.950020007852835 ], [ 7.680976477484883, 51.949846593947818 ] ] ] } },
        { "type": "Feature", "properties": { "class": "Versiegelt" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 7.689979878996324, 51.952778775237121 ], [ 7.689928723305917, 51.951785638530744 ], [ 7.691898217386547, 51.9512338864117 ], [ 7.692256307219387, 51.952195507138718 ], [ 7.689979878996324, 51.952778775237121 ] ] ] } },
        { "type": "Feature", "properties": { "class": "Gewässer" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 7.697371876259982, 51.949468234009203 ], [ 7.696860319355923, 51.949231757426539 ], [ 7.695862783393008, 51.949736239295468 ], [ 7.695786049857396, 51.949625884371564 ], [ 7.696783585820314, 51.949089870878382 ], [ 7.697474187640793, 51.949310583092625 ], [ 7.697371876259982, 51.949468234009203 ] ] ] } }
        ]
        }, 
      "Hyperparameter": [
        { "name": "mtry", "value": "5"},
        { "name": "ntree", "value": "2"}
      ],
      "Resolution": 10
    };
    const response = await request(app)
      .post('/api/demoClassify')
      .send(false_demoClassify_payload)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    // if the request-Body isnt the same as demodata.json 422 should be returned
    expect(response.statusCode).toBe(422);
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.body).toBeInstanceOf(Object);
  });
});
