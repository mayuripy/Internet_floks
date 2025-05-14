import Sequelize from "@sequelize/core";
import { PG_CLIENT_MIN_MSG, PG_DB, PG_HOST, PG_PASSWORD, PG_PORT, PG_SSL, PG_USER } from "../config";
import { PostgresDialect } from "@sequelize/postgres";


/**
 * Database connection configuration using Sequelize.
 * 
 * This configuration sets up a connection to a PostgreSQL database using Sequelize,
 * an ORM for Node.js. It defines parameters such as database name, username, password,
 * host, port, SSL usage, and client minimum message level.
 */

export const sequelize = new Sequelize({
  dialect: PostgresDialect,     // The dialect of the database (e.g., 'postgres')
  database: PG_DB,              // Name of the PostgreSQL database
  user: PG_USER,                // Username for database authentication
  password: PG_PASSWORD,        // Password for database authentication
  host: PG_HOST,                // Database host address
  port: Number(PG_PORT),        // Port number of the database server
  ssl: Boolean(PG_SSL),         // Whether to use SSL for the connection (true/false)
  logging: false,               // Disable Sequelize's logging (true to enable)
  clientMinMessages: PG_CLIENT_MIN_MSG,  // Minimum message level for client messages
});
