const db = require('../db/connection.js');
const fs = require('fs/promises')

function selectTopics(){
  return db.query('SELECT * FROM topics;').then((result) => {
    return result.rows;
  });
};

function getFile(){
  
return fs.readFile(`${__dirname}/../endpoints.json`).then((files)=>{ 

return JSON.parse(files)

})}

function selectArticleById(article_id){
 
  return db
    .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No user found for article: ${article_id}`,
        });
      }
      return result.rows[0];
      })
      
    }

function selectAllArticles(req){

      return db
        .query(`SELECT
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.article_id) AS comment_count
      FROM
        articles
      LEFT JOIN
        comments ON articles.article_id = comments.article_id
      GROUP BY
     articles.article_id
      ORDER BY
        articles.created_at DESC;`)
        .then((result) => {
          return result.rows
        
          
        })
      }


      function selectArticleComment(article_id){
      
        return db
    .query('SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at ASC;', [article_id])
       
        
    .then((result) => {
      console.log(result.rows)
      if (result.rows.length === 0 ) {
        return Promise.reject({
          status: 404,
          msg: `No user found for article: ${article_id}`,
        });
      }
      return result.rows;
      })
  
        
      }

module.exports = {selectTopics , getFile , selectArticleById ,  selectAllArticles , selectArticleComment}