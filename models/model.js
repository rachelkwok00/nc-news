const db = require('../db/connection.js');
const fs = require('fs/promises')

function selectTopics(){
  return db.query('SELECT * FROM topics;').then((result) => {
    return result.rows;
  });
};

function returnData(){
  
return fs.readFile(`${__dirname}/../endpoints.json`).then((files)=>{ 

return JSON.parse(files)

})}

module.exports = {selectTopics , returnData}