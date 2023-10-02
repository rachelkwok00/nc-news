# Northcoders News API
 
 Follow these steps to have the necessary environment variables and dependencies for the nc_news project.These instructions will also help in setting up and seeding your databases.

1.Clone the repository
-git clone https://github.com/rachelkwok00/nc-news

2.Create Enviroment Variable Files
- .env.development - in your file add PGDATABASE=nc_news
- .env.test - in your file add PGDATABASE=nc_news_test

3.Install dependencies
-npm install

4.Seed database
-npm run setup-dbs

5.Connect to the database through psql inside terminal
psql
\c nc_news_test
\c nc_news_test

6.Continue to seed database
npm run seed


