const express = require('express')
const app = express()

const {
    selectTopics,
    getFile,
  selectArticleById,
  selectAllArticles,
  selectArticleComment

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
      res.status(200).send({ article });
    })
      .catch(err => {
      
        next(err);
      })
  };

  exports.fetchArticles = (req, res, next) => {
    
    selectAllArticles(req).then((articles) => {
      res.status(200).send({ articles });
    })
      .catch(err => {
    
        next(err);
      })
  };

  exports.fetchArticlesComment = (req, res, next) => {

    const { article_id } = req.params;
    selectArticleComment(article_id).then((comment) => {

      res.status(200).send({ comment });
    })
      .catch(err => {
       next(err);
      })
  };