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
    test("Should return an object with property topics", () => {
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

             const topics = result.body.topics
            expect(topics.length).toBe(3)
            topics.forEach(topic=>{
                expect(topic).toHaveProperty("slug", expect.any(String))
                expect(topic).toHaveProperty("description", expect.any(String))
            })
            })
    
        })
    })
        
 describe('/api/', () => {
            test('GET:200 sends a single team to the client', () => {
              return request(app)
                .get('/api')
                .expect(200)
                .then((response) => {
                
                  expect(typeof response.body.apiEndpoints).toBe('object');
                });
            });
            test("Should return an object with the property apiEndpoints", () => {
                return request(app).get("/api").expect(200).then(response => {

                    expect(response.body).hasOwnProperty("apiEndpoints");
                    expect(response.body).toBeInstanceOf(Object);
                
                })
            })
            test("Should return an nested object each with the property description,queries,exampleResponse", () => {
                return request(app).get("/api").expect(200).then(response => {
                
                    const responseObj = response.body.apiEndpoints
                    
                     
                    expect(responseObj).toBeInstanceOf(Object);
                    expect(Object.keys(responseObj).length).toBe(3);

                    console.log(responseObj,'HERE!!')


                    for (const endpoint in responseObj) {
                        const obj = responseObj[endpoint];
        
                        expect(obj).toBeInstanceOf(Object);
                        expect(obj).toHaveProperty("description", expect.any(String));
                        expect(obj).toHaveProperty("queries", expect.any(Array));
                        expect(obj).toHaveProperty("exampleResponse", expect.any(Object));
                        }
                })
            })
        })