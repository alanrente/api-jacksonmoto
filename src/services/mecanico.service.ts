import conexao from "../infra/database";
import { Sequelize } from "sequelize";
import { MecanicoModel } from "../models/mecanico.model";

export class MecanicoService {
  private conection: Sequelize;
  private mecanicoModel: typeof MecanicoModel;

  constructor() {
    this.conection = conexao();
    this.mecanicoModel = MecanicoModel;
  }

  async getAll() {
    const mecanicos = await this.mecanicoModel.findAll();
    await this.conection.close();
    return mecanicos;
  }
}
