const db = require('../db/connection.js');
const fs = require('fs/promises')

function getTopics() {

  return db.query('SELECT * FROM topics;').then((result) => {
    return result.rows;
  });
};

function getFile() {

  return fs.readFile(`${__dirname}/../endpoints.json`).then((files) => {

    return JSON.parse(files)

  })
}

function selectArticleById(article_id) {

  return db
    .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article found : ${article_id}`,
        });
      }
      return result.rows[0];
    })
}

function checkTopic(topic){

  if(!topic){
    return []
  }
  return db.query(`SELECT * FROM topics WHERE slug = $1;`,[topic]).then((result)=>{
  if(result.rows.length === 0){
    return Promise.reject ({
      status: 400,
      msg : 'Invalid topic'
      })
}
    return result.rows
  
    
  })
}

function selectAllArticles( sortby = 'created_at', topic) {
  
    let query = `SELECT
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.article_id) AS comment_count
      FROM articles 
      LEFT JOIN comments ON articles.article_id = comments.article_id
  ` 
  
        const values = []

if(topic){
  query += ` WHERE articles.topic = $1`
  values.push(topic)
}
  
  query +=   ` GROUP BY articles.article_id ORDER BY articles.created_at DESC;`

        return db.query(query, values).then(({rows}) => {
     
      return rows

    })
}

function selectArticleComment(article_id) {

  return db
    .query('SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at ASC;', [article_id])

    .then((result) => {
      return result.rows;
    }
    );
};

function addComment(article_id, newComment) {
  
  const { username, body } = newComment;


  return db.query(`INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`,
    [article_id, username, body]

  ).then((result) => {

    return result.rows[0]
  })

}

function changeVotes(article_id, newComment) {

const { vote_increment } = newComment;

  return db.query(`
  UPDATE  articles 
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *;`,[vote_increment , article_id ]
    

  ).then((result) => {
    if (result.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `No article found : ${article_id}`,
    });
  }
    
    return result.rows[0]
  })

}

function removeComment(comment_id) {
  
    return db.query(`
   DELETE FROM comments
   WHERE comment_id = $1;`,
   [comment_id]
    ).then((result) => {
      
      if (result.rowCount === 0) {
         return Promise.reject({
        status: 400,
        msg: `No comment found : ${comment_id}`,
      }); 
      }
     return result.rows
    })
  
  }




function getUsers() {
  
    return db.query(`
  SELECT * FROM users;`,
  
    ).then((result) => {
      
     return result.rows
    })
  
  }
module.exports = { getTopics, getFile, selectArticleById, selectAllArticles, selectArticleComment, addComment ,changeVotes, removeComment,getUsers , checkTopic}