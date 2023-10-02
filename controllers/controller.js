const express = require('express')
const app = express()

const {
    selectTopics
  } = require('../models/model.js');
  
  exports.getTopics = (req, res, next) => {
    selectTopics()
    .then(result => {
      res.status(200).send({topics : result});
    })
    .catch(err => {
      next(err);
    });
  };

