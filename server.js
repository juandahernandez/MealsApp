const { app } = require('./app');

// utils
const { db } = require('./util/database');
const { initModels } = require('./util/initModels');

db.authenticate()
  .then(() => console.log('Database authenticated'))
  .catch((err) => console.log(err));

initModels();

db.sync({ force: false })
  .then(() => console.log('Database synced'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server on port: ${PORT}`);
});
