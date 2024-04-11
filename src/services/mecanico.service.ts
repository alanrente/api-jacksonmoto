import conexao from "../infra/database";
import { Sequelize } from "sequelize";
import { CategoriaModel } from "../models/categoria.model";

export class MecanicoService {
  private conection: Sequelize;
  private categoriaModel: typeof CategoriaModel;

  constructor() {
    this.conection = conexao();
    this.categoriaModel = CategoriaModel;
  }

  async getAll() {
    const categorias = await this.categoriaModel.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    await this.conection.close();
    return categorias;
  }
}
