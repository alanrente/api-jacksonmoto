import conexao from "../infra/database";
import { Sequelize } from "sequelize";
import { CategoriaModel, getCategoriaModel } from "../models/CategoriaModel";

export class CategoriaService {
  private conection: Sequelize;
  private categoriaModel: typeof CategoriaModel;

  constructor() {
    this.conection = conexao();
    this.categoriaModel = getCategoriaModel(this.conection);
  }

  async getAll() {
    const categorias = await this.categoriaModel.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    await this.conection.close();
    return categorias;
  }
}
