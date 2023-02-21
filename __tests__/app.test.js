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

describe("200: GET /api/categories", () => {
  it("should respond with an array of categories", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body.categories)).toBe(true);
      });
  });
  it("response array should be the correct length as the data", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((response) => {
        const arr = response.body.categories;
        expect(arr.length).toBe(4);
      });
  });
  it("each item in the returned array should contain a key of slug and description ", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((response) => {
        const arr = response.body.categories;
        arr.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("200: GET /api/reviews", () => {
  it("should return an array of all review objects", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        expect(response.body.reviews).toBeInstanceOf(Array);
      });
  });
  it("response array should match the length of the test data", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        const arr = response.body.reviews;
        expect(arr.length).toBe(13);
      });
  });
  it("each item in the returned array should contain the correct keys", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        const arr = response.body.reviews;
        arr.forEach((review) => {
          expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  it("should return the reviews sorted in date descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        const arr = response.body.reviews;
        expect(arr).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("200: GET /api/reviews/:review_id/comments", () => {
  it("should return an array of comments", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toBeInstanceOf(Array);
      });
  });
  it("should contain comment objects that contain the correct keys", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then((response) => {
        const arr = response.body.comments;
        arr.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            review_id: 3,
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });
  it("should return the comments sorted by most recent frst", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then((response) => {
        const arr = response.body.comments;
        expect(arr).toBeSortedBy("created_at", { descending: true });
      });
  });
  it('should return an empty array if passed a review_id that is correct and exists but does not have any comments attached', () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then((response) => {
        const arr = response.body.comments
        expect(arr.length).toBe(0)
      })
  });
  describe('ERRORS', () => {
    it('should respond with a 404 error if the user inputs a review id that does not exist', () => {
      return request(app)
        .get("/api/reviews/100/comments")
        .expect(404)
        .then(({body}) => {
          expect(body.msg).toBe("review id does not exist")
        })
    });
    it('should respond with a 400 error if the user does not input a number', () => {
      return request(app)
        .get("/api/reviews/aidan/comments")
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe("bad request")
        })
    });
  });





})

describe("200: GET api/reviews/:review_id", () => {
  it("the returned object should contain all the correct keys", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then((response) => {
        expect(response.body.review).toMatchObject({
          review_id: expect.any(Number),
          owner: expect.any(String),
          title: expect.any(String),
          category: expect.any(String),
          review_img_url: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          designer: expect.any(String),
          review_body: expect.any(String),
        });
      });
  });
});

describe("404:", () => {
  test("should respond with a 404 msg when the user enters a review id that is not in the database", () => {
    return request(app).get("/api/reviews/20").expect(404).then(({body}) => {
      expect(body.msg).toBe("review id does not exist")
    })
  });
  test("should give a 404 error when an incorrect endpoint is provided", () => {
    return request(app).get("/aasdjaisdj").expect(404).then(({body}) => {
      expect(body.msg).toBe("incorrect endpoint")
    })
  });
});

describe("400 bad request incorrect id type", () => {
  test("should return a 400 error if user does not provide a number to the endpoint", () => {
    return request(app)
      .get("/api/reviews/aidansreview")
      .expect(400)
      .then((response) => {
        const msg = response.body.msg
        expect(msg).toBe("bad request");
      });
  });
});

describe('201: POST: should add a comment to the review', () => {
  it('should respond with the posted comment', () => {
    const testComment = {username: "bainesface", body: "i disagree with this review"}
  return request(app)
    .post("/api/reviews/1/comments")
    .send(testComment)
    .expect(201)
    .then(({body}) => {
      expect(body.comment).toMatchObject({
        author: expect.any(String),
        body: "i disagree with this review",
        comment_id: expect.any(Number),
        created_at: expect.any(String),
        review_id: 1,
        votes: 0,
      })
    })
  });
  describe('Error handling', () => {
    it('400: POST: should return a 400 error when given a id that is not a number', () => {
      return request(app)
        .post("/api/reviews/asdj/comments")
        .send({username: "bainesface", body: "review is terrible"})
        .expect(400)
        .then((response) => {
          const msg = response.body.msg
          expect(msg).toBe("bad request")
        })
    });
    it('404: POST: Should return a 404 error when the ID does not exist', () => {
      return request(app)
        .post("/api/reviews/10000/comments")
        .send({username: "bainesface", body: "review is terrible"})
        .expect(404)
        .then((response) => {
          const msg = response.body.msg
          expect(msg).toBe("review id does not exist")
        })
    });
    it('404: POST: Should return a 404 error when the username in body is not in the database', () => {
        return request(app)
        .post("/api/reviews/3/comments")
        .send({username: "Aidan", body: "i hate this review"})
        .expect(404)
    });
    it('400: POST: should return a 400 if the body is not a valid string', () => {
        return request(app)
        .post("/api/reviews/3/comments")
        .send({username: "bainesface", body: 0})
        .expect(400)
        .then((response) => {
          const msg = response.body.msg
          expect(msg).toBe("body needs to be a string")
        })
    });
  });
});