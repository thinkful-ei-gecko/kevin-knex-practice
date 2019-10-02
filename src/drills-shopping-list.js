require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
});

/**********************************************************
  DRILL #1 
***********************************************************/
function getTextItems(searchTerm) {
  knexInstance
    .select('name')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then((result) => {
      console.log(result);
    });
}
// getTextItems('fish');

/**********************************************************
  DRILL #2
***********************************************************/
function paginateItems(pageNumber) {
  const productsPerPage = 6;
  const offset = productsPerPage * (pageNumber - 1);
  knexInstance
    .select('*')
    .from('shopping_list')
    .limit(productsPerPage)
    .offset(offset)
    .then((result) => {
      console.log(result);
    });
}
// paginateItems(2);

/**********************************************************
  DRILL #3
***********************************************************/
function getItemsAfterDate(daysAgo) {
  knexInstance
    .select('*')
    .from('shopping_list')
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .then((result) => {
      console.log(result);
    });
}

// getItemsAfterDate(1);

/**********************************************************
  DRILL #4
***********************************************************/
function getTotalCostPerCategory() {
  knexInstance
    .select('category')
    .sum('price')
    .from('shopping_list')
    .groupBy('category')
    .then((result) => {
      console.log(result);
    });
}
// getTotalCostPerCategory();