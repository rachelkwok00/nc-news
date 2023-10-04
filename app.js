const express = require('express');
const app = express();
app.use (express.json()) ;
const {
    getTopics,
    getData,
    getArticleById,
    fetchArticles,
    fetchArticlesComment,
    postComment
} = require('./controllers/controller.js');


app.get('/api/topics', getTopics);
app.get('/api', getData);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles', fetchArticles);
app.get('/api/articles/:article_id/comments', fetchArticlesComment);
app.post('/api/articles/:article_id/comments', postComment);

app.all('/*', (req, res, next) => {
  res.status(404).send({msg: "No match found"});
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  if (err.code === "22P02") {
    
    res.status(400).send({msg: "Bad request"});
  } else {
    next(err)
  }
})

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;