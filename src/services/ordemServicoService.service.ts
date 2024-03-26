import moment from "moment";
import conexao from "../infra/database";
import { Conection } from "../interfaces/Conection.interface";
import { MecanicoModel } from "../models/MecanicoModel";
import { OS_ServicosModel } from "../models/OS_ServicosModel";
import { OrdemServicoModel } from "../models/OrdemServicoModel";
import { IOsServicoPost } from "../interfaces/OrdemServicoRequest.interface";
import { ServicoModel } from "../models/ServicoModel";

export class OrdemServicoService extends Conection {
  private ordemServicoModel: typeof OrdemServicoModel;
  private osServicosModel: typeof OS_ServicosModel;
  private mecanicoModel: typeof MecanicoModel;

  constructor() {
    super(conexao());
    this.ordemServicoModel = OrdemServicoModel;
    this.osServicosModel = OS_ServicosModel;
    this.mecanicoModel = MecanicoModel;
  }

  async getAll() {
    const categorias = await this.ordemServicoModel.findAll({
      include: {
        model: ServicoModel,
        attributes: {
          include: [
            `${ServicoModel.getAttributes().servico.field}`,
            `${ServicoModel.getAttributes().valor.field}`,
          ],
        },
        as: "servicos",
      },
    });
    await this.closeConection();
    return categorias;
  }
  async createOSServico({ mecanicoId, servicosId }: IOsServicoPost) {
    const transacao = await this.conection.transaction();
    try {
      const dataExecucao = moment().format("YYYY-MM-DD");
      const ordemServicoCriada = await this.ordemServicoModel.create(
        {
          dataExecucao,
          mecanicoId,
        },
        { transaction: transacao }
      );

      for await (let id of servicosId) {
        await this.osServicosModel.create(
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
