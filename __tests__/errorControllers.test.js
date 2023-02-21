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
      .get("/aasdjaisdj")
      .expect(404)
      .then((response) => {console.log(response)});
  });
});

describe("404 review id does not exist", () => {
  test("should respond with a 404 msg when the user enters a review id that is not in the database", () => {
    return request(app).get("/api/reviews/20").expect(404);
  });
});

describe("400 bad request", () => {
  test("should return a 400 error if user does not provide a number to the endpoint", () => {
    return request(app).get("/api/reviews/aidansreview").expect(400);
  });
});
