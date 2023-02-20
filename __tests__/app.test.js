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
        
    });
});
