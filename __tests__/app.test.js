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
            expect(Array.isArray(response.body)).toBe(true)
        })
    });
    it('each item in the returned array should contain a key of slug and description ', () => {
        return request(app)
            .get("/api/categories")
            .expect(200)
            .then((response) => {
                const arr = response.body
                arr.forEach((category) => {
                    expect(category).toMatchObject({
                        slug: expect.any(String),
                        description: expect.any(String),
                    })
                })
            })
    });
});
