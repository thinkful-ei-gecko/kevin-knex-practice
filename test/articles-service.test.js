const ArticlesService = require('../src/articles-service');
const knex = require('knex');

describe('ArticlesService', () => {
  let db;
  const tableName = 'blogful_articles';
  const testArticles = [
    {
      id: 1,
      date_published: new Date('2029-01-22T16:28:32.615Z'),
      title: 'First test post!',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
    {
      id: 2,
      date_published: new Date('2100-05-22T16:28:32.615Z'),
      title: 'Second test post!',
      content:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.',
    },
    {
      id: 3,
      date_published: new Date('1919-12-22T16:28:32.615Z'),
      title: 'Third test post!',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat.',
    },
  ];

  /************************************************************************************
  SCAFFOLDING
*************************************************************************************/
  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
  });

  before(() => {
    return db(`${tableName}`).truncate();
  });

  afterEach(() => {
    return db(`${tableName}`).truncate();
  });

  after(() => {
    return db.destroy();
  });

  /************************************************************************************
  CONTEXT (HAS DATA)
*************************************************************************************/
  context(`Given ${tableName} has data`, () => {
    beforeEach(() => {
      // these two expressions are the same because knex method chaining is flexible
      // return db.into(`${testTable}`).insert(testArticles);
      return db.insert(testArticles).into(`${tableName}`);
    });

    it(`getAllArticles() resolves all articles from ${tableName} table`, () => {
      return ArticlesService.getAllArticles(db).then((actual) => {
        expect(actual).to.eql(
          testArticles.map((article) => ({
            ...article,
            date_published: new Date(article.date_published),
          }))
        );
      });
    });

    it(`getArticleById() resolves an article by id from ${tableName} table`, () => {
      const thirdId = 3;
      const thirdTestArticle = testArticles[thirdId - 1];
      return ArticlesService.getArticleById(db, thirdId).then((actual) => {
        expect(actual).to.eql({
          id: thirdId,
          title: thirdTestArticle.title,
          content: thirdTestArticle.content,
          date_published: new Date(thirdTestArticle.date_published),
        });
      });
    });

    it(`deleteArticleById() removes an article by id from ${tableName} table`, () => {
      const articleId = 3;
      return ArticlesService.deleteArticleById(db, articleId)
        .then(() => ArticlesService.getAllArticles(db))
        .then((actual) => {
          // copy the test articles array without the "deleted" article
          const expected = testArticles.filter(
            (article) => article.id !== articleId
          );
          expect(actual).to.eql(expected);
        });
    });

    it(`updateArticleById() updates an article from the ${tableName} table`, () => {
      const idOfArticleToUpdate = 3;
      const newArticleData = {
        title: 'updated title',
        content: 'updated content',
        date_published: new Date(),
      };
      return ArticlesService.updateArticleById(
        db,
        idOfArticleToUpdate,
        newArticleData
      )
        .then(() => ArticlesService.getArticleById(db, idOfArticleToUpdate))
        .then((article) => {
          expect(article).to.eql({
            id: idOfArticleToUpdate,
            ...newArticleData,
          });
        });
    });
  });

  /************************************************************************************
  CONTEXT (HAS NO DATA)
*************************************************************************************/
  context(`Given ${tableName} has NO data`, () => {
    it('getAllArticles() resolves an empty array', () => {
      return ArticlesService.getAllArticles(db).then((actual) => {
        expect(actual).to.eql([]);
      });
    });

    it(`insertArticle() inserts a new article and resolves the new article with an 'id'`, () => {
      const newArticle = {
        title: 'Test new title',
        content: 'Test new content',
        date_published: new Date('2020-01-01T00:00:00.000Z'),
      };
      return ArticlesService.insertArticle(db, newArticle).then((actual) => {
        expect(actual).to.eql({
          id: 1,
          title: newArticle.title,
          content: newArticle.content,
          date_published: new Date(newArticle.date_published),
        });
      });
    });
  });
});
