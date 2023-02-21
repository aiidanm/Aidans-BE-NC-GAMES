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

describe("404 incorrect endpoint", () => {
  test("should give a 404 error when an incorrect endpoint is provided", () => {
    return request(app)
      .get("/api/asdjaisdj")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("incorrect endpoint");
      });
  });
});

describe("", () => {});
