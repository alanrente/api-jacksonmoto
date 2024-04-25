import { Sequelize } from "sequelize";
import * as pg from "pg";

const { database, username, password, host } = {
  database: `${process.env.DB_DATABASE}`,
  username: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  host: `${process.env.DB_HOST}`,
};

const loggerQuery = (sql: string) => {
  console.log(sql);
};

export default () => {
  try {
    const sequelize = new Sequelize(database, username, password, {
      dialect: "postgres",
      host: host,
      schema: process.env.DB_SCHEMA,
      timezone: "-03:00",
      logging: process.env.NODE_ENV == "development" ? loggerQuery : false,
      dialectModule: pg,
    });
    console.log("banco conectado!");
    return sequelize;
  } catch (err: any) {
    throw new Error(err.message);
  }
};
