const express = require('express')
const app = express()

const {
    getTopics,
    getFile,
  selectArticleById,
  selectAllArticles,
  selectArticleComment,
  addComment,
  changeVotes,
  removeComment,
  getUsers,
  checkTopic
  } = require('../models/model.js');

  app.use(express.json());
  
  exports.fetchTopics = (req, res, next) => {
   
    getTopics()
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

    const  { sortby , topic} = req.query
   
    Promise.all([
 selectAllArticles(sortby ,topic),
 checkTopic(topic)
    ]).then(([articles]) => {
     
      res.status(200).send({ articles });
    })
      .catch(err => {
    
        next(err);
      })
  };

  exports.fetchArticlesComment = (req, res, next) => {

    const { article_id } = req.params;

    Promise.all([
      
      selectArticleComment(article_id),
      selectArticleById(article_id),
    ])

    .then(([comment]) => {
      
      res.status(200).send({ comment });
    
    })
      .catch(err => {
       next(err);
      })
  };

  exports.postComment = (req, res, next) => {
    
    const { article_id } = req.params;
    const newComment  = req.body;
      
      addComment(article_id,newComment).then((comment) => {
      
      res.status(201).send({comment}); 
   
  
    })
      .catch(err => {
       next(err);
      })
  };

  exports.patchArticle = (req, res, next) => {
  
    const { article_id } = req.params;
    const voteIncrement  = req.body;

    changeVotes(article_id,voteIncrement).then((article) => {
      
      res.status(200).send({article}); 
   
  
    })
      .catch(err => {
       next(err);
      })
  };
  
  exports.deleteComment = (req, res, next) => {
  
    const { comment_id } = req.params;

    removeComment(comment_id).then(() => {
      
      res.status(204).send();
  
    })
      .catch(err => {
       next(err);
      })
  };


  exports.fetchUsers = (req, res, next) => {
  
   getUsers().then((users) => {
      
      res.status(200).send({users});
  
    })
      .catch(err => {
       next(err);
      })
  };