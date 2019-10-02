require('dotenv').config();
const knex = require('knex');
const ArticlesService = require('./articles-service');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
});

// ArticlesService.getAllArticles(knexInstance)
//   .then((articles) => console.log(articles))
//   .then(() =>
//     ArticlesService.insertArticle(knexInstance, {
//       title: 'New title',
//       content: 'New content',
//       date_published: new Date(),
//     })
//   )
//   .then((newArticle) => {
//     console.log(newArticle);
//     return ArticlesService.updateArticleById(knexInstance, newArticle.id, {
//       title: 'Updated title',
//     }).then(() => ArticlesService.getArticleById(knexInstance, newArticle.id));
//   })
//   .then((article) => {
//     console.log(article);
//     return ArticlesService.deleteArticleById(knexInstance, article.id);
//   });
