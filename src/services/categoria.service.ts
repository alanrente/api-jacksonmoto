import conexao from "../infra/database";
import { Sequelize } from "sequelize";
import { CategoriaModel } from "../models/categoria.model";

export class CategoriaService {
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

  async getOne(categoriaId: number) {
    const categoria = await CategoriaModel.findOne({
      where: { categoriaId },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    await this.conection.close();
    return categoria;
  }

  async create(categoria: string) {
    if (!categoria) {
      throw new Error("Categoria inválida!");
    }
    const categoriaCreated = await CategoriaModel.create({
      categoria: categoria,
    });
    await this.conection.close();
    return categoriaCreated;
  }

  async update(categoriaId: number, novaCategoria: string) {
    const categoria = await this.getOne(categoriaId);
    if (!categoria) {
      throw new Error(`categoria ${categoriaId} não encontrada`);
    }

    categoria.categoria = novaCategoria;
    const categoriaUpdated = await categoria.save();
    return categoriaUpdated;
  }
}
