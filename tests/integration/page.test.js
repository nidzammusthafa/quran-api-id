const supertest = require('supertest');
const httpStatus = require('http-status');
const app = require('../../src/app');

describe('GET /pages/:pageNumber', () => {
  describe('when page exists', () => {
    test('should return a 200 status code', async () => {
      const request = await supertest(app).get('/pages/1');
      expect(request.status).toBe(httpStatus.OK);
    });

    test('should return correct array of objects', async () => {
      const request = await supertest(app).get('/pages/1');
      expect(request.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            number: expect.any(Number),
            name: expect.any(String),
            translation: expect.any(String),
            revelation: expect.any(String),
            numberOfAyahs: expect.any(Number),
            ayahs: expect.arrayContaining([
              expect.objectContaining({
                number: expect.objectContaining({
                  inQuran: expect.any(Number),
                  inSurah: expect.any(Number),
                }),
                meta: expect.objectContaining({
                  page: 1,
                }),
              }),
            ]),
          }),
        ])
      );
    });
  });

  describe('when page does not exist', () => {
    test('should return a 400 status code for invalid page number', async () => {
      const request = await supertest(app).get('/pages/605');
      expect(request.status).toBe(httpStatus.BAD_REQUEST);
    });
  });
});
