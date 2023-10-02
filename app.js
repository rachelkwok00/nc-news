const express = require('express');
const app = express();
app.use (express.json()) ;
const {
    getTopics,
    getData
} = require('./controllers/controller.js');


app.get('/api/topics', getTopics);
app.get('/api', getData);

app.all('/*', (req, res, next) => {
  res.status(404).send({msg: "Invalid api endpoint"});
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send({ msg: 'Internal Server Error' });
  });
  
  app.use((err, req, res, next) => {
    if (err === "Invalid query") {
      res.status(400).send({msg: "Invalid order query"});
    }
    next(err);})

module.exports = app;