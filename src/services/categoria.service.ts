import conexao from "../infra/database";
import { Sequelize } from "sequelize";
import getCategoriaModel from "../models/CategoriaModel";

export class CategoriaService {
  private conection: Sequelize;

  constructor() {
    this.conection = conexao();
  }

  async getAll() {
    const categoriaModel = await getCategoriaModel(this.conection);
    const categorias = await categoriaModel.findAll();
    await this.conection.close();
    return categorias;
  }

  async getOne(categoriaId: number) {
    const categoriaModel = await getCategoriaModel(this.conection);
    const categoria = await categoriaModel.findOne({ where: { categoriaId } });
    await this.conection.close();
    return categoria;
  }
}
