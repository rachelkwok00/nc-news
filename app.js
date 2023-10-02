const express = require('express');
const app = express();
app.use (express.json()) ;
const {
    getTopics,
    addToApi
} = require('./controllers/controller.js');


app.get('/api/topics', getTopics);
app.get('/api', addToApi);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send({ msg: 'Internal Server Error' });
  });
  
module.exports = app;