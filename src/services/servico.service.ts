import conexao from "../infra/database";
import { ServicoModel } from "../models/ServicoModel";
import { Conection } from "../interfaces/Conection.interface";

export class ServicoService extends Conection {
  private servicoModel: typeof ServicoModel;

  constructor() {
    super(conexao());
    this.servicoModel = ServicoModel;
  }

  async getAll() {
    const categorias = await this.servicoModel.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    await this.closeConection();
    return categorias;
  }
}
