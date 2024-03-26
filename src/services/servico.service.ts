import conexao from "../infra/database";
import { Sequelize } from "sequelize";
import { ServicoModel } from "../models/ServicoModel";

export class ServicoService {
  private conection: Sequelize;
  private servicoModel: typeof ServicoModel;

  constructor() {
    this.conection = conexao();
    this.servicoModel = ServicoModel;
  }

  async getAll() {
    const categorias = await this.servicoModel.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    await this.closeConection();
    return categorias;
  }

  private async closeConection() {
    await this.conection.close().then(() => {
      console.log("banco desconectado");
    });
  }
}
