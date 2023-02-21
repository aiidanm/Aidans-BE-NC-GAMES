const request = require("supertest")
const db = require("../db/connection")
const app = require("../app")
const data = require("../db/data/test-data/index")
const seed = require("../db/seeds/seed")
 

beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    return db.end()
})


describe('200: GET /api/categories', () => {
    it('should respond with an array of categories', () => {
        return request(app)
        .get("/api/categories")
        .expect(200)
        .then((response) => {
            expect(Array.isArray(response.body.categories)).toBe(true)
        })
    });
    it('response array should be the correct length as the data', () => {
        return request(app)
            .get("/api/categories")
            .expect(200)
            .then((response) => {
                const arr = response.body.categories
                expect(arr.length).toBe(4)
            })
    });
    it('each item in the returned array should contain a key of slug and description ', () => {
        return request(app)
            .get("/api/categories")
            .expect(200)
            .then((response) => {
                const arr = response.body.categories
                arr.forEach((category) => {
                    expect(category).toMatchObject({
                        slug: expect.any(String),
                        description: expect.any(String),
                    })
                })
            })
    });
});

describe('200: GET /api/reviews', () => {
    it('should return an array of all review objects', () => {
        return request(app)
            .get("/api/reviews")
            .expect(200)
            .then((response) => {
                expect(response.body.reviews).toBeInstanceOf(Array)
            })
    });
    it('response array should match the length of the test data', () => {
        return request(app)
            .get("/api/reviews")
            .expect(200)
            .then((response) => {
                const arr = response.body.reviews
                expect(arr.length).toBe(13)
            })
    });
    it('each item in the returned array should contain the correct keys', () => {
        return request(app)
            .get("/api/reviews")
            .expect(200)
            .then((response) => {
                const arr = response.body.reviews
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
                    })
                })
            })
    });
    it('should return the reviews sorted in date descending order', () => {
        return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((response) => {
            const arr = response.body.reviews
            expect(arr).toBeSortedBy('created_at', {descending: true})
        })    
    });
});

describe('204: POST: should add a comment to the review', () => {
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
});