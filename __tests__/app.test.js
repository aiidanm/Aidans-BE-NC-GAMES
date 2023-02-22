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


describe('200: Patch: should respond with the updated review object ', () => {
    it('should respond with the correct review when updated', () => {
      const voteObj = {inc_votes: 1}
        return request(app)
          .patch("/api/reviews/3")
          .send(voteObj)
          .expect(200)
          .then((response) => {
            const review = response.body.review
            expect(review).toMatchObject({
              review_id: 3,
              owner: expect.any(String),
              title: expect.any(String),
              category: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              designer: expect.any(String),
              review_body: expect.any(String),
            })
          })
    });
    it('should increase the count correctly when passed a positive number', () => {
      const voteObj = {inc_votes: 1}
      return request(app)
          .patch("/api/reviews/3")
          .send(voteObj)
          .expect(200)
          .then((response) => {
            const review = response.body.review
            expect(review.votes).toBe(6)
          })
    });
    it('should decrease the count if passed a negative number', () => {
      const voteObj = {inc_votes: -101}
      return request(app)
          .patch("/api/reviews/3")
          .send(voteObj)
          .expect(200)
          .then((response) => {
            const review = response.body.review
            expect(review.votes).toBe(-96)
          })
    });
    it('should still work and respond with review when there are extra keys in the object', () => {
      const voteObj = {inc_votes: -101, msg: "my votes to increase!"}
      return request(app)
          .patch("/api/reviews/3")
          .send(voteObj)
          .expect(200)
          .then((response) => {
            const review = response.body.review
            expect(review.votes).toBe(-96)
          })
    });
    describe('PATCH: Error handling', () => {
      it('404: should respond with a 404 if passed an incorrect reviewID', () => {
        const voteObj = {inc_votes: -101}
        return request(app)
          .patch("/api/reviews/20")
          .send(voteObj)
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe("review id does not exist")
          })
      });
      it('400: should respond with a 400 error if passed a wrong format review id', () => {
        const voteObj = {inc_votes: -101}
        return request(app)
          .patch("/api/reviews/test")
          .send(voteObj)
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("bad request")
          })
      });
      it('400: should respond with a 400 error if object does not contain inc_votes', () => {
        const voteObj = {msg: -101}
        return request(app)
          .patch("/api/reviews/3")
          .send(voteObj)
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("you need to provide a inc_votes object")
          })
      });
      it('400: should respond with a 400 error if the votes is not a number', () => {
        const voteObj = {inc_votes: "asda"}
        return request(app)
          .patch("/api/reviews/3")
          .send(voteObj)
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("need to provide a number")
          })
      });
    });
});