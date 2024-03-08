import { Sequelize } from "sequelize";

export class Conexao {
  sequelize: Sequelize;
  constructor() {
    const { database, username, password, host } = {
      database: `${process.env.DB_DATABASE}`,
      username: `${process.env.DB_USERNAME}`,
      password: `${process.env.DB_PASSWORD}`,
      host: `${process.env.DB_HOST}`,
    };
    this.sequelize = new Sequelize(database, username, password, {
      dialect: "postgres",
      host: host,
      schema: process.env.DB_SCHEMA,
    });
  }

  async close() {
    await this.sequelize
      .close()
      .then(() => {
        console.log("conexao fechada!!");
      })
      .catch((err: any) => {
        console.log("error: ", JSON.stringify(err));
      });
  }
}
