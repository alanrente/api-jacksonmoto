import conexao from "../infra/database";
import { ServicoModel } from "../models/servico.model";
import { Conection } from "../interfaces/Conection.interface";
import { IServico } from "../interfaces/OrdemServico.interface";
import { Sequelize, Transaction } from "sequelize";

export class ServicoService extends Conection {
  private servicoModel: typeof ServicoModel;

  constructor(conexaoExistente?: Sequelize) {
    super(conexaoExistente || conexao());
    this.servicoModel = ServicoModel;
  }

  async getAll(usuario: string) {
    const categorias = await this.servicoModel.findAll({
      where: { usuario },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    await this.closeConection();
    return categorias;
  }

  async createMany({
    servicos,
    usuario,
    transaction,
  }: {
    servicos: IServico[];
    usuario: string;
    transaction?: Transaction;
  }) {
    if (servicos.length == 0) return servicos;

    const mapServicosWithoutId = servicos.map(({ servico, valor }) => ({
      servico,
      valor: +valor,
      usuario,
    }));
    const servicosCreated = await this.servicoModel.bulkCreate(
      mapServicosWithoutId,
      { transaction }
    );
    return servicosCreated;
  }
}
