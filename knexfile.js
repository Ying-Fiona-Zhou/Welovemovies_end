const path = require("path");
require("dotenv").config();

const {
  DATABASE_URL = "postgresql://postgres@localhost/postgres",
  NODE_ENV = "development",
} = process.env;

module.exports = {
  development: {
    client: "pg",
    connection: DATABASE_URL,  // 本地用自己的 PostgreSQL
    pool: { min: 0, max: 5 },
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
  },

  production: {
    client: "pg",
    connection: {
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },  // Render 需要 SSL
    },
    pool: { min: 2, max: 10 },
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
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
