import moment from "moment";
import conexao from "../infra/database";
import { Conection } from "../interfaces/Conection.interface";
import { MecanicoModel } from "../models/MecanicoModel";
import { OsServicosModel } from "../models/OSServicosModel";
import { OrdemServicoModel } from "../models/OrdemServicoModel";
import { IOsServicoPost } from "../interfaces/OrdemServicoRequest.interface";
import { ServicoModel } from "../models/ServicoModel";

export class OrdemServicoService extends Conection {
  constructor() {
    super(conexao());
  }

  async getAll() {
    const ordensServicos = await OrdemServicoModel.findAll({
      attributes: { exclude: ["createdAt", "updatedAt", "mecanicoId"] },
      include: [
        {
          model: ServicoModel,
          attributes: {
            include: [
              `${ServicoModel.getAttributes().servico.field}`,
              `${ServicoModel.getAttributes().valor.field}`,
            ],
            exclude: ["createdAt", "updatedAt"],
          },
          required: true,
        },
        {
          model: MecanicoModel,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          required: true,
        },
      ],
    });
    await this.closeConection();
    return ordensServicos;
  }
  async createOSServico({ mecanicoId, servicosId }: IOsServicoPost) {
    const transacao = await this.conection.transaction();
    try {
      const dataExecucao = moment().format("YYYY-MM-DD");
      const ordemServicoCriada = await OrdemServicoModel.create(
        {
          dataExecucao,
          mecanicoId,
        },
        { transaction: transacao }
      );

      for await (let id of servicosId) {
        await OsServicosModel.create(
          {
            OrdemServicoId: ordemServicoCriada.idOrdemServico,
            ServicoId: id,
          },
          { transaction: transacao }
        );
      }

      await transacao.commit();
      return ordemServicoCriada;
    } catch (error: any) {
      await transacao.rollback();
      throw new Error(error);
    }
  }
}
