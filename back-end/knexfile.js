/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */

const path = require("path");

const {
  DATABASE_URL = "postgres://jiqbuoob:8tJUehlm-bhs3b9ZG-N0Lw1VrzmJfffd@batyr.db.elephantsql.com/jiqbuoob",
  DATABASE_URL_DEVELOPMENT = "postgres://jiqbuoob:8tJUehlm-bhs3b9ZG-N0Lw1VrzmJfffd@batyr.db.elephantsql.com/jiqbuoob",
  DATABASE_URL_TEST = "postgres://jiqbuoob:8tJUehlm-bhs3b9ZG-N0Lw1VrzmJfffd@batyr.db.elephantsql.com/jiqbuoob",
  DATABASE_URL_PREVIEW = "postgres://jiqbuoob:8tJUehlm-bhs3b9ZG-N0Lw1VrzmJfffd@batyr.db.elephantsql.com/jiqbuoob",
  DEBUG,
} = process.env;

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_DEVELOPMENT,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  test: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_TEST,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  preview: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_PREVIEW,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  production: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
};
