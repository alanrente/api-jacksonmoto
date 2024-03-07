import { Sequelize } from "sequelize";

const { database, username, password, host } = {
  database: `${process.env.DB_DATABASE}`,
  username: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  host: `${process.env.DB_HOST}`,
};

export const sequelize = new Sequelize(database, username, password, {
  dialect: "postgres",
  host: host,
  schema: process.env.DB_SCHEMA,
});
