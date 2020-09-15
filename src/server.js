const knex = require('knex');
const app = require('./app');
const { PORT } = require('./config');

const db = knex({
  client: 'pg',
  connection: "postgresql://dunder_mifflin:abcd@localhost/budget-me"
})

app.set('db', db);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
});