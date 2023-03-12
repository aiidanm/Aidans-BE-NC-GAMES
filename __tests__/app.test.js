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
  describe("200: QUERIES ", () => {
    describe("/api/reviews/QUERIES", () => {
      it("should return reviews array with only reviews of category ", () => {
        return request(app)
          .get("/api/reviews?category=euro+game")
          .expect(200)
          .then((response) => {
            const arr = response.body.reviews;
            arr.forEach((review) => {
              expect(review.category).toBe("euro game");
            });
          });
      });
      it("should sort by created_at if not passed anything else", () => {
        return request(app)
          .get("/api/reviews?category=euro+game")
          .expect(200)
          .then((response) => {
            const arr = response.body.reviews;
            expect(arr).toBeSortedBy("created_at", { descending: true });
          });
      });
      it("should allow user to sort by any column name", () => {
        return request(app)
          .get("/api/reviews?sort_by=owner")
          .expect(200)
          .then((response) => {
            const arr = response.body.reviews;
            expect(arr).toBeSortedBy("owner", { descending: true });
          });
      });
      it("should allow user to sort ASC if they want to", () => {
        return request(app)
          .get("/api/reviews?order_by=ASC")
          .expect(200)
          .then((response) => {
            const arr = response.body.reviews;
            expect(arr).toBeSortedBy("created_at", { ascending: true });
          });
      });
      it("should work even when the queries have extra keys that are not needed", () => {
        return request(app)
          .get("/api/reviews?category=euro+game&msg=1")
          .expect(200)
          .then((response) => {
            const arr = response.body.reviews;
            arr.forEach((review) => {
              expect(review.category).toBe("euro game");
            });
          });
      });
      it("should allow all 3 queries to work at the same time", () => {
        return request(app)
          .get("/api/reviews?category=euro+game&sort_by=owner&order_by=ASC")
          .expect(200)
          .then((response) => {
            const arr = response.body.reviews;
            arr.forEach((review) => {
              expect(review.category).toBe("euro game");
            });
            expect(arr).toBeSortedBy("owner", { ascending: true });
          });
      });
    });
  });
  describe("/api/reviews/queries ERROR handling", () => {
    it("should respond with a 404 if the category does not exist", () => {
      return request(app)
        .get("/api/reviews?category=fun")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("invalid category provided");
        });
    });
    it("should respond with a 400 if the category provided is not a string", () => {
      return request(app)
        .get("/api/reviews?category=1")
        .expect(400)
        .then((response) => {

          expect(response.body.msg).toBe("category needs to be a string");
        });
    });
    it("should respond with a 404 if the sort_by column does not exist", () => {
      return request(app)
        .get("/api/reviews?sort_by=fun")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("invalid sort_by provided");
        });
    });
    it("should respond with a 400 if passed a sort_by that is not a string", () => {
      return request(app)
        .get("/api/reviews?sort_by=1")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("sort by needs to be a string");
        });
    });
    it("should respond with a 400 if passed a order by that is neither ASC or DESC", () => {
      return request(app)
        .get("/api/reviews?order_by=1")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("order by should be ASC or DESC");
        });
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
  it("should return an empty array if passed a review_id that is correct and exists but does not have any comments attached", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then((response) => {
        const arr = response.body.comments;
        expect(arr.length).toBe(0);
      });
  });
  describe("ERRORS", () => {
    it("should respond with a 404 error if the user inputs a review id that does not exist", () => {
      return request(app)
        .get("/api/reviews/100/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("review id does not exist");
        });
    });
    it("should respond with a 400 error if the user does not input a number", () => {
      return request(app)
        .get("/api/reviews/aidan/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
  });
});

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

  it("should now contain a comment_count column with the correct amount of comments on that review", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then((response) => {
        expect(response.body.review.comment_count).toBe(3);
      });
  });

  describe("ERROR HANDLING", () => {
    describe("404:", () => {
      test("should respond with a 404 msg when the user enters a review id that is not in the database", () => {
        return request(app)
          .get("/api/reviews/20")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("review id does not exist");
          });
      });
      test("should give a 404 error when an incorrect endpoint is provided", () => {
        return request(app)
          .get("/aasdjaisdj")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("incorrect endpoint");
          });
      });
    });
    describe("400 bad request incorrect id type", () => {
      test("should return a 400 error if user does not provide a number to the endpoint", () => {
        return request(app)
          .get("/api/reviews/aidansreview")
          .expect(400)
          .then((response) => {
            const msg = response.body.msg;
            expect(msg).toBe("bad request");
          });
      });
    });
  });
});

describe("200: GET /api/users", () => {
  it("should respond with an array of object containing username, name and avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const arr = response.body.users;
        expect(arr.length).toBe(4)
        arr.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  describe("/api/users Error handling", () => {
    it("404 should respond with 404 if passed an incorrect endpoint", () => {
      return request(app)
        .get("/api/user")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("incorrect endpoint");
        });
    });
  });
});

describe("201: POST: should add a comment to the review", () => {
  it("should respond with the posted comment", () => {
    const testComment = {
      username: "bainesface",
      body: "i disagree with this review",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(testComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          author: expect.any(String),
          body: "i disagree with this review",
          comment_id: expect.any(Number),
          created_at: expect.any(String),
          review_id: 1,
          votes: 0,
        });
      });
  });
  it("201: should respond with the comment even if passed an object with extra keys", () => {
    const testComment = {
      username: "bainesface",
      body: "i disagree with this review",
      votes: 10,
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(testComment)
      .expect(201);
  });

  describe("Error handling", () => {
    it("400: POST: should return a 400 error when given a id that is not a number", () => {
      return request(app)
        .post("/api/reviews/asdj/comments")
        .send({ username: "bainesface", body: "review is terrible" })
        .expect(400)
        .then((response) => {
          const msg = response.body.msg;
          expect(msg).toBe("bad request");
        });
    });
    it("404: POST: Should return a 404 error when the ID does not exist", () => {
      return request(app)
        .post("/api/reviews/10000/comments")
        .send({ username: "bainesface", body: "review is terrible" })
        .expect(404)
        .then((response) => {
          const msg = response.body.msg;
          expect(msg).toBe("review id does not exist");
        });
    });
    it("404: POST: Should return a 404 error when the username in body is not in the database", () => {
      return request(app)
        .post("/api/reviews/3/comments")
        .send({ username: "Aidan", body: "i hate this review" })
        .expect(404);
    });
    it("400: POST: should return a 400 if the body is not a valid string", () => {
      return request(app)
        .post("/api/reviews/3/comments")
        .send({ username: "bainesface", body: 0 })
        .expect(400)
        .then((response) => {
          const msg = response.body.msg;
          expect(msg).toBe("body needs to be a string");
        });
    });
    it("400: Post: should return a 404 error if the passed object doesnt contain the correct keys", () => {
      return request(app)
        .post("/api/reviews/3/comments")
        .send({ text: "i agree!" })
        .expect(400)
        .then((response) => {
          const msg = response.body.msg;
          expect(msg).toBe("comment needs to contain a username and body");
        });
    });
  });
});

describe("200: Patch: should respond with the updated review object ", () => {
  it("should respond with the correct review when updated", () => {
    const voteObj = { inc_votes: 1 };
    return request(app)
      .patch("/api/reviews/3")
      .send(voteObj)
      .expect(200)
      .then((response) => {
        const review = response.body.review;
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
        });
      });
  });
  it("should increase the count correctly when passed a positive number", () => {
    const voteObj = { inc_votes: 1 };
    return request(app)
      .patch("/api/reviews/3")
      .send(voteObj)
      .expect(200)
      .then((response) => {
        const review = response.body.review;
        expect(review.votes).toBe(6);
      });
  });
  it("should decrease the count if passed a negative number", () => {
    const voteObj = { inc_votes: -101 };
    return request(app)
      .patch("/api/reviews/3")
      .send(voteObj)
      .expect(200)
      .then((response) => {
        const review = response.body.review;
        expect(review.votes).toBe(-96);
      });
  });
  it("should still work and respond with review when there are extra keys in the object", () => {
    const voteObj = { inc_votes: -101, msg: "my votes to increase!" };
    return request(app)
      .patch("/api/reviews/3")
      .send(voteObj)
      .expect(200)
      .then((response) => {
        const review = response.body.review;
        expect(review.votes).toBe(-96);
      });
  });
  describe("PATCH: Error handling", () => {
    it("404: should respond with a 404 if passed an incorrect reviewID", () => {
      const voteObj = { inc_votes: -101 };
      return request(app)
        .patch("/api/reviews/20")
        .send(voteObj)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("review id does not exist");
        });
    });
    it("400: should respond with a 400 error if passed a wrong format review id", () => {
      const voteObj = { inc_votes: -101 };
      return request(app)
        .patch("/api/reviews/test")
        .send(voteObj)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("bad request");
        });
    });
    it("400: should respond with a 400 error if object does not contain inc_votes", () => {
      const voteObj = { msg: -101 };
      return request(app)
        .patch("/api/reviews/3")
        .send(voteObj)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "you need to provide a inc_votes object"
          );
        });
    });
    it("400: should respond with a 400 error if the votes is not a number", () => {
      const voteObj = { inc_votes: "asda" };
      return request(app)
        .patch("/api/reviews/3")
        .send(voteObj)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("need to provide a number");
        });
    });
  });
});

describe('200: GET /api', () => {
  it('should return a json object of all the endpoints the api has', () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body.endpoints).toMatchObject({
          "GET /api": expect.any(Object),
          'GET /api/categories':expect.any(Object),
          'GET /api/reviews': expect.any(Object),
          'GET /api/reviews/:id': expect.any(Object),
          'GET /api/reviews/:id/comments': expect.any(Object),
          'GET /api/users': expect.any(Object),
          'PATCH: /api/reviews/id': expect.any(Object),
          'POST: /api/reviews/id/comments': expect.any(Object),
        })
      })
  });
});

describe('204: DELETE. should respond delete comment and respond with a 204', () => {
    it('should respond with status 204 and delete the comment', () => {
        return request(app)
          .delete("/api/comments/2")
          .expect(204)

    });
    describe('Error handling', () => {
        it('404 should respond with 404 error if passed an id that is valid but does not exist', () => {
          return request(app)
          .delete("/api/comments/200")
          .expect(404)
          .then((response) => {
            const msg = response.body.msg
            expect(msg).toBe("comment id does not exist")
          })
        });
        it('should respond with a 400 error if passed a id that is not a string', () => {
          return request(app)
          .delete("/api/comments/aidans")
          .expect(400)
          .then((response) => {
            const msg = response.body.msg
            expect(msg).toBe("bad request")
          })
        });
    });
}); 
