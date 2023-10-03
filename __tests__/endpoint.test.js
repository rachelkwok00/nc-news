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
                    
                    for (const endpoint in responseObj) {
                        const obj = responseObj[endpoint];
        
                        expect(obj).toBeInstanceOf(Object);
                        expect(obj).toHaveProperty("description", expect.any(String));
                        expect(obj).toHaveProperty("queries", expect.any(Array));
                        expect(obj).toHaveProperty("exampleResponse", expect.any(Object));
                        }
                })
            })
            test('GET:404 sends a error when the endpoint does not exist', () => {
                return request(app)
                  .get('/not-a-api')
                  .expect(404)
                  .then((response) => {
                expect(response.body.msg).toBe("No match found");
                  });
              });
        })

        describe('/api/articles/:article_id', () => {
            test('GET:200 sends a single article object to the client', () => {
              return request(app)
                .get('/api/articles/3')
                .expect(200)
                .then((response) => {
             
                  expect(typeof response.body.article).toBe('object');
                });
            });
           
          test("Should return a object with the properties author ,title, article_id, body. topic, created_at,  votes, article_img_url", () => {
                  return request(app).get("/api/articles/4").expect(200).then(response => {

                      const responseObj = response.body.article

                      expect(Object.keys(responseObj).length).toBe(8);


                expect(responseObj).toHaveProperty("author", expect.any(String));
                  expect(responseObj).toHaveProperty("title", expect.any(String));
                  expect(responseObj).toHaveProperty("article_id", expect.any(Number));
                  expect(responseObj).toHaveProperty("body", expect.any(String));
                  expect(responseObj).toHaveProperty("topic", expect.any(String));
                  expect(responseObj).toHaveProperty("created_at", expect.any(String)); 
                  expect(responseObj).toHaveProperty("votes", expect.any(Number));
                  expect(responseObj).toHaveProperty("article_img_url", expect.any(String));
                          
                  })
              })
              test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
                return request(app)
                  .get("/api/articles/5000000")
                  .expect(404)
                  .then((response) => {
                    
                    expect(response.body.msg).toBe("No user found for article: 5000000");
                    
                  });
              });
              test('GET:400 responds with an appropriate error message when given an invalid id', () => {
                return request(app)
                  .get("/api/articles/not-a-id")
                  .expect(400)
                  .then((response) => {
                    expect(response.body.msg).toBe('Bad request');
                  });
              });

        })