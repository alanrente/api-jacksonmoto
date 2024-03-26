import { Sequelize } from "sequelize";

export class Conection {
  protected conection: Sequelize;
  constructor(conexao: Sequelize) {
    this.conection = conexao;
  }

  protected async closeConection() {
    await this.conection.close().then(() => {
      console.log("banco desconectado");
    });
  }
}
