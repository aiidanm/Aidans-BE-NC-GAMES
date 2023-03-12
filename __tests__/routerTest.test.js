const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe('router testing', () => {
    it('should work on /api endpoint', () => {
    });
    it('should work on /api/users', () => {
        
    });
    it('should work on /api/categories', () => {
        
    });
    it('should work on /api/reviews', () => {

    });

});