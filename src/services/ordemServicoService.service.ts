import moment from "moment";
import conexao from "../infra/database";
import { Conection } from "../interfaces/Conection.interface";
import { MecanicoModel } from "../models/MecanicoModel";
import { OsServicosModel } from "../models/OSServicosModel";
import { OrdemServicoModel } from "../models/OrdemServicoModel";
import {
  IOsServicoPost,
  IServico,
} from "../interfaces/OrdemServicoRequest.interface";
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

  async createOSWithoutServicosAndMecanico({
    mecanico,
    servicos,
  }: {
    mecanico: string;
    servicos: IServico[];
  }) {
    const transacao = await this.conection.transaction();
    try {
      const idsMecanicoAndServicos = {} as IOsServicoPost;

      const findOrCreateMecanicoByName = await MecanicoModel.findCreateFind({
        where: { nome: mecanico },
        transaction: transacao,
      });

      idsMecanicoAndServicos.mecanicoId =
        findOrCreateMecanicoByName[0].idMecanico;

      const servicosIds: number[] = [];
      for await (const servico of servicos) {
        const findOrCreateServicoByName = await ServicoModel.findCreateFind({
          where: { servico: servico.servico, valor: servico.valor },
          transaction: transacao,
        });

        servicosIds.push(findOrCreateServicoByName[0].dataValues.idServico);
      }
      idsMecanicoAndServicos.servicosId = servicosIds;
      console.log("idsMecanicoAndServicos", idsMecanicoAndServicos);
      await transacao.commit();

      return await this.createOSServico(idsMecanicoAndServicos);
    } catch (error: any) {
      await transacao.rollback();
      throw new Error(error.message);
    }
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
