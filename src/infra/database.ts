import { Sequelize } from "sequelize";

class Conexao {
  sequelize: Sequelize;
  static numero = 0;
  constructor() {
    Conexao.numero++;
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
    console.log(`Conexão[${Conexao.numero}] aberta!`);
  }

  async close() {
    await this.sequelize
      .close()
      .then(() => {
        console.log(`Conexão[${Conexao.numero}] fechada!`);
      })
      .catch((err: any) => {
        console.log("error: ", JSON.stringify(err));
      });
  }
}

export default Conexao;
