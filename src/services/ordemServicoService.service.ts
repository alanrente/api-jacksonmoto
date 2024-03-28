import moment from "moment";
import conexao from "../infra/database";
import { Conection } from "../interfaces/Conection.interface";
import { MecanicoModel } from "../models/MecanicoModel";
import { OsServicosModel } from "../models/OSServicosModel";
import { OrdemServicoModel } from "../models/OrdemServicoModel";
import {
  IOSMapper,
  IOsServicoPost,
  IServico,
} from "../interfaces/OrdemServico.interface";
import { ServicoModel } from "../models/ServicoModel";
import { InferAttributes, WhereOptions } from "sequelize";
import { IOrdemServico } from "../interfaces/Models.interface";

export class OrdemServicoService extends Conection {
  constructor() {
    super(conexao());
  }

  private mapperGetAll(ordemServico: any[]): IOSMapper[] {
    return ordemServico.map((os) => {
      const retorno = {} as IOSMapper;
      retorno.idOrdemServico = os.idOrdemServico;
      retorno["dataExecucao"] = os.dataExecucao;
      retorno.idMecanico = os.mecanico.idMecanico;
      retorno.nomeMecanico = os.mecanico.nome;
      retorno.servicos = os.servicos.map((servico: IServico) => ({
        idServico: servico.idServico,
        servico: servico.servico,
        valor: servico.valor,
      }));
      retorno.totalOS = os.servicos.reduce(
        (servA: IServico, servB: IServico) =>
          Number(servA.valor) + Number(servB.valor)
      );
      retorno.totalMecanico = retorno.totalOS / 2;
      return retorno;
    });
  }

  async getAll(mecanicoId?: number) {
    const condition: WhereOptions<InferAttributes<IOrdemServico>> | undefined =
      mecanicoId ? { mecanicoId } : {};

    const ordensServicos = await OrdemServicoModel.findAll({
      where: condition,
      attributes: { exclude: ["createdAt", "updatedAt", "mecanicoId"] },
      include: [
        {
          model: MecanicoModel,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          required: true,
        },
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
      ],
    });
    await this.closeConection();
    return this.mapperGetAll(ordensServicos);
  }

  async create({
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

  private async createOSServico({ mecanicoId, servicosId }: IOsServicoPost) {
    const transacao = await this.conection.transaction();
    try {
      const dataExecucao = moment().format("YYYY-MM-27");
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
