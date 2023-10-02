const db = require("../db/connection.js");
const request = require('supertest');
const app = require('../app.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/');


beforeEach(()=> seed(testData))
afterAll(() => db.end());

describe('/api/topics', ()=>{
    test('responds with status code 200', ()=>{
        return request(app).get('/api/topics')
        .expect(200)
    })
    test("Should return an object with property treasures", () => {
        return request(app).get("/api/topics").expect(200).then(result => {
             expect(Array.isArray(result.body.topics)).toBe(true);
        })
    })
    test("Should return an object with the property topics", () => {
        return request(app).get("/api/topics").expect(200).then(result => {
            expect(result).hasOwnProperty("topics");
        })
    })
    test("Should return an nested object each with the property slug and description", () => {
        return request(app).get("/api/topics").expect(200).then(result => {

            result.body.topics.forEach(obj=>{
                expect(obj).hasOwnProperty("slug")
                expect(obj).hasOwnProperty("description")
            })
    
        })
    })
    
})
