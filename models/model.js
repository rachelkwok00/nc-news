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
  
  

module.exports = {selectTopics , getFile , selectArticleById }