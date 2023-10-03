const express = require('express')
const app = express()

const {
    selectTopics,
    getFile,
  selectArticleById
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

  exports.getData = (req, res , next) => {
    getFile ()
    .then(result => {
      res.status(200).send({apiEndpoints : result});
    })
    .catch(err => {
      next(err);
    });
  }

  exports.getArticleById = (req, res, next) => {
   
    const { article_id } = req.params;
    selectArticleById(article_id).then((article) => {
      if (article === "No article") {
       return next("No match found");
      }
      res.status(200).send({ article });
    })
      .catch(err => {
      
        next(err);
      })
  };