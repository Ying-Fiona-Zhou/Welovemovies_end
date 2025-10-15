const { PORT = 5001 } = process.env;

const app = require("./app");
const knex = require("./db/connection");

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server is listening on port ${PORT}`);
});

knex.migrate
  .latest()
  .then((migrations) => {
    console.log("migrations", migrations);
    app.listen(PORT, listener);
  })
  .catch(console.error);
