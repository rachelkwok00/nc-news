const express = require('express');
const app = express();
app.use (express.json()) ;
const {
    getTopics,
    getData,
    getArticleById
} = require('./controllers/controller.js');


app.get('/api/topics', getTopics);
app.get('/api', getData);
app.get('/api/articles/:article_id', getArticleById);



app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  else if (err.code === "23502" || err.code === "22P02" || "Invalid query") {
    res.status(400).send({msg: "Bad request"});
  }
})

app.all('/*', (req, res, next) => {
  res.status(404).send({msg: "No match found"});
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send({ msg: "Internal Server Error" });
  });

module.exports = app;