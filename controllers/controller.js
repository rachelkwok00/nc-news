const express = require('express')
const app = express()

const {
    selectTopics,
    returnData
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

  exports.addToApi = (req, res , next) => {
    returnData ()
    .then(result => {
      res.status(200).send({apiEndpoints : result});
    })
    .catch(err => {
      next(err);
    });
  }