const path = require("path");
require("dotenv").config();

const {
  DATABASE_URL = "postgresql://postgres@localhost/postgres",
  NODE_ENV = "development",
} = process.env;

module.exports = {
  development: {
    client: "pg",
    connection: DATABASE_URL,  // local PostgreSQL
    pool: { min: 0, max: 5 },
    migrations: {
      directory: "./src/db/migrations",
    },
    seeds: {
      directory: "./src/db/seeds",
    },
  },

  production: {
    client: "pg",
    connection: {
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },  // Render need SSL
    },
    pool: { min: 2, max: 10 },
    migrations: {
      directory: "./src/db/migrations",
    },
    seeds: {
      directory: "./src/db/seeds",
    },
  },

  test: {
    client: "sqlite3",
    connection: { filename: ":memory:" },
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    useNullAsDefault: true,
  },
};
