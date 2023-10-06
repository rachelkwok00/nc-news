const db = require("../db/connection.js");
const request = require('supertest');
const app = require('../app.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/');

beforeEach(() => seed(testData))
afterAll(() => db.end());

describe('/api/topics', () => {
  test('responds with status code 200', () => {
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
      topics.forEach(topic => {
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

      const expectedResponse = {
        article_id: 4,
        title: 'Student SUES Mitch!',
        topic: 'mitch',
        author: 'rogersop',
        body: 'We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages',
        created_at: '2020-05-06T01:14:00.000Z',
        votes: 0,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      };

      expect(responseObj).toEqual(expectedResponse);

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

describe('/api/articles', () => {

  test("The array returned should be the correct length and contain the correct properties,not body", () => {

    return request(app)
      .get('/api/articles')
      .expect(200)
      .then((response) => {

        const articleArr = response.body.articles

        expect(articleArr.length).toBe(13)

        articleArr.forEach((article) => {
          expect(article).toHaveProperty('author', expect.any(String));
          expect(article).toHaveProperty('title', expect.any(String));
          expect(article).toHaveProperty('article_id', expect.any(Number));
          expect(article).toHaveProperty('topic', expect.any(String));
          expect(article).toHaveProperty('created_at', expect.any(String));
          expect(article).toHaveProperty('votes', expect.any(Number));
          expect(article).toHaveProperty('article_img_url', expect.any(String));
          expect(article).toHaveProperty('comment_count', expect.any(String));
          expect(article).not.toHaveProperty('body');

        })
      })
  })
  test("Returned array should be sorted by descending order of aricles created at", () => {
    return request(app).get("/api/articles").expect(200).then(result => {


      const articlesArr = result.body.articles;


      expect(articlesArr).toBeSorted({ key: "created_at", descending: true })

    })
  })

})
describe('/api/articles/:article_id/comment', () => {

  test("GET: Should return a array with the properties comment_id, body, article_id, votes, created_at, author", () => {
    return request(app).get("/api/articles/1/comments").expect(200).then(response => {

      const responseObj = response.body.comment

      expect(responseObj.length).toBe(11);

      responseObj.forEach(obj => {

        expect(obj).toBeInstanceOf(Object);
        expect(obj).toHaveProperty("comment_id", expect.any(Number));
        expect(obj).toHaveProperty("body", expect.any(String));
        expect(obj).toHaveProperty("article_id", expect.any(Number));
        expect(obj).toHaveProperty("votes", expect.any(Number));
        expect(obj).toHaveProperty("created_at", expect.any(String));
        expect(obj).toHaveProperty("author", expect.any(String));
      })
    })
  })
  test('GET:200 sends back a empty array when no comments are found with a valid article_id', () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comment).toEqual([]);

      });
  });
  test('GET:404 sends an appropriate status and error message when given a valid but non-existent article id', () => {
    return request(app)
      .get("/api/articles/5000000/comments")
      .expect(404)
      .then((response) => {

        expect(response.body.msg).toBe("No user found for article: 5000000");

      });
  });
  test('GET:400 responds with an appropriate error message when given an invalid id', () => {
    return request(app)
      .get("/api/articles/not-a-id/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad request');
      });
  });
  test("Returned array should be sorted by ascending order of comments created at", () => {
    return request(app).get("/api/articles/5/comments").expect(200).then(result => {

      const commentArr = result.body.comment;

      expect(commentArr).toBeSorted({ key: "created_at", ascending: true })

    })
  })
})

describe('POST/api/articles/:article_id/comment', () => {

  test("Should return a 201 status when passed a correct comment object", () => {

    const newComment = {
      username: "butter_bridge",
      body: "new comment"
    };

    return request(app).post("/api/articles/1/comments").send(newComment).expect(201).then(result => {

      expect(result.body.comment.author).toBe("butter_bridge")
      expect(result.body.comment.body).toBe("new comment")
      expect(result.body.comment.article_id).toBe(1)
      expect(result.body.comment.comment_id).toBe(19)
      expect(typeof result.body.comment.created_at).toBe("string")
      expect(result.body.comment.votes).toBe(0)

      
    })
  })
  test("Should return a 201 status when passed a larger object, which should be ignored", () => {

    const newComment = {
      username: "butter_bridge",
      body: "new comment",
      email: "example-email@gmail.com",
      date : "14-12-34"
    };

    return request(app).post("/api/articles/1/comments").send(newComment).expect(201).then(result => {
      
      expect(result.body.comment.author).toBe("butter_bridge")
      expect(result.body.comment.body).toBe("new comment")
      expect(result.body.comment.article_id).toBe(1)
      expect(result.body.comment.comment_id).toBe(19)
      expect(typeof result.body.comment.created_at).toBe("string")
      expect(result.body.comment.votes).toBe(0)

    })
  })
  test('GET:404 sends an appropriate status and error message when given a valid but non-existent article id', () => {

    const newComment = {
      username: "butter_bridge",
      body: "new comment"
    };

    return request(app).post("/api/articles/5000000/comments").send(newComment)
      .expect(404)
      .then((response) => {

        expect(response.body.msg).toBe("Not found");

      });
  });
  test('GET:404 sends an appropriate status and error message when username is non-existent', () => {

    const newComment = {
      username: "Rachel",
      body: "new comment",
    };

    return request(app).post("/api/articles/5/comments").send(newComment)
      .expect(404)
      .then((response) => {

        expect(response.body.msg).toBe('Not found');

      });
  });
  test('GET:400 responds with an appropriate error message when given an invalid id', () => {

    const newComment = {
      username: "butter_bridge",
      body: "new comment"
    };

    return request(app).post("/api/articles/not-a-id/comments").send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad request');
      });
  });

  test('GET:400 responds with an appropriate error message when missing username or body', () => {

    const newComment = {
     email: 'example-email@gmail.com'
    };

    return request(app).post("/api/articles/5/comments").send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad request');
      });
  });

})

describe('PATCH/api/articles/:article_id', () => {

  test('PATCH:200 sends a single article object to the client with vote increment', () => {

      const testVote = { vote_increment : 6 }

    return request(app)
      .patch("/api/articles/1").send(testVote)
      .expect(200)
      .then((response) => {
        console.log(response.body)
      const articleObj= response.body
     
        expect(articleObj).toBeInstanceOf(Object)

        expect(articleObj.article.votes).toBe(106)
        expect(articleObj.article.votes).toBe(106)
   
    
    })
  });  
  test('PATCH:400 sends a error when invalid id is passed', () => {

      const testVote = { vote_increment : 6 }

    return request(app)
      .patch("/api/articles/not-a-id").send(testVote)
      .expect(400)
      .then((response) => {

        expect(response.body.msg).toBe('Bad request');
        
      });
    })
    test('PATCH:400 sends a error when vote_increment value is not a number', () => {

      const testVote = { vote_increment : 'not-a-number' }

    return request(app)
      .patch("/api/articles/6").send(testVote)
      .expect(400)
      .then((response) => {

        expect(response.body.msg).toBe('Bad request');
        
      });
    })
    test('PATCH:400 sends a error when object key is not vote_increment', () => {

      const testVote = { notVoteIncrement : 9 }

    return request(app)
      .patch("/api/articles/6").send(testVote)
      .expect(400)
      .then((response) => {

        expect(response.body.msg).toBe('Bad request');
        
      });
    })
  test('PATCH:404 sends a error when id does not exist', () => {

      const testVote = { vote_increment : 6 }

    return request(app)
      .patch("/api/articles/67676767").send(testVote)
      .expect(404)
      .then((response) => {
        
        expect(response.body.msg).toBe("No user found for article: 67676767");
        
      });
    })
  })