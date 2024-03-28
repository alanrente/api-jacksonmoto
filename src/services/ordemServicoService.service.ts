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
import { InferAttributes, Op, Transaction, WhereOptions } from "sequelize";
import { IOrdemServico } from "../interfaces/Models.interface";

export class OrdemServicoService extends Conection {
  constructor() {
    super(conexao());
  }

  private mapperGetAll(ordemServico: any[], somarOS?: boolean) {
    const ordensServicos = ordemServico.map((os) => {
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
      retorno.totalOS =
        os.servicos.length > 1
          ? os.servicos.reduce(
              (servA: IServico, servB: IServico) =>
                Number(servA.valor) + Number(servB.valor)
            )
          : Number(os.servicos[0].valor);
      retorno.totalMecanico = Number(retorno.totalOS) / 2;
      return retorno;
    });
    const totaisOs: any =
      ordensServicos.length > 1
        ? ordensServicos.map((a) => a.totalOS).reduce((a, b) => a + b)
        : ordensServicos[0].totalOS;

    return somarOS ? { ordensServicos, totaisOs } : { ordensServicos };
  }

  async getAll(mecanicoId?: number) {
    try {
      const condition:
        | WhereOptions<InferAttributes<IOrdemServico>>
        | undefined = mecanicoId
        ? {
            mecanicoId,
            dataExecucao: { [Op.gte]: "2024-03-24", [Op.lte]: "2024-03-27" },
          }
        : {};

      const ordensServicos = await OrdemServicoModel.findAll({
        where: condition,
        include: [
          {
            model: MecanicoModel,
            required: true,
          },
          {
            model: ServicoModel,
            attributes: {
              include: [
                `${ServicoModel.getAttributes().servico.field}`,
                `${ServicoModel.getAttributes().valor.field}`,
              ],
            },
            required: true,
          },
        ],
      });

      await this.closeConection();

      if (ordensServicos.length == 0) return { ordensServicos };

      return this.mapperGetAll(ordensServicos, true);
    } catch (error: any) {
      throw new Error(error);
    }
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
      for await (const { servico, valor } of servicos) {
        let servicoToInclude = null;
        servicoToInclude = await ServicoModel.findOne({
          where: { servico },
          transaction: transacao,
        });

        if (!servicoToInclude) {
          servicoToInclude = await ServicoModel.create(
            { servico, valor: Number(valor) },
            { transaction: transacao }
          );
        }

        servicosIds.push(servicoToInclude.idServico);
      }
      idsMecanicoAndServicos.servicosId = servicosIds;

      return await this.createOSServico({
        iOsServicoPost: idsMecanicoAndServicos,
        transaction: transacao,
      });
    } catch (error: any) {
      await transacao.rollback();
      throw new Error(error.message);
    }
  }

  private async createOSServico({
    iOsServicoPost,
    transaction,
  }: {
    iOsServicoPost: IOsServicoPost;
    transaction?: Transaction;
  }) {
    const transacao = transaction
      ? transaction
      : await this.conection.transaction();
    try {
      const dataExecucao = moment().format("YYYY-MM-25");
      const ordemServicoCriada = await OrdemServicoModel.create(
        {
          dataExecucao,
          mecanicoId: iOsServicoPost.mecanicoId,
        },
        { transaction: transacao }
      );

      for await (let id of iOsServicoPost.servicosId) {
        await OsServicosModel.create(
          {
            OrdemServicoId: ordemServicoCriada.idOrdemServico,
            ServicoId: id,
          },
          { transaction: transacao }
        );
      }

      await transacao.commit();
      await this.closeConection();
      return ordemServicoCriada;
    } catch (error: any) {
      await transacao.rollback();
      await this.closeConection();
      throw new Error(error);
    }
  }
}
