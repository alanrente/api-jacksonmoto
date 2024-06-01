import moment from "moment";
import conexao from "../infra/database";
import { Conection } from "../interfaces/Conection.interface";
import { MecanicoModel } from "../models/mecanico.model";
import { OsServicosModel } from "../models/oSServicos.model";
import { OrdemServicoModel } from "../models/ordemServico.model";
import {
  IMecanico,
  IOSIDServicoID,
  IOSMapper,
  IOsServicoPost,
  IServico,
  ServicosAddOs,
  ServicosRelationOS,
} from "../interfaces/OrdemServico.interface";
import { ServicoModel } from "../models/servico.model";
import {
  HasOne,
  IncludeOptions,
  Includeable,
  InferAttributes,
  Op,
  Sequelize,
  Transaction,
  WhereOptions,
} from "sequelize";
import {
  ICliente,
  IMecanicoModel,
  IOrdemServico,
  IOsServicos,
  IServicoModel,
} from "../interfaces/Models.interface";
import { ClienteModel } from "../models/cliente.model";
import { ServicoService } from "./servico.service";

export class OrdemServicoService extends Conection {
  constructor() {
    super(conexao());
  }

  private mapperGetAll(ordemServico: any[]): any[] {
    const ordensServicos: any = ordemServico.map(
      ({ servicos, mecanico, cliente, ...dataValues }) => {
        let totalOs = 0,
          totalMecanico = 0;

        if (servicos.length > 1) {
          totalOs = servicos
            .map((servico: IServicoModel & { osServico: any }) =>
              Number(servico.osServico.valor)
            )
            .reduce((a: number, b: number) => {
              return a + b;
            });

          totalMecanico = servicos
            .map((servico: IServicoModel & { osServico: any }) =>
              Number(servico.osServico.valorPorcentagem)
            )
            .reduce((a: number, b: number) => a + b);
        }

        if (servicos.length === 1) {
          totalOs = Number(servicos[0].valor);
          totalMecanico = Number(servicos[0].osServico.valorPorcentagem);
        }

        return {
          ...dataValues,
          mecanico: { ...mecanico.dataValues },
          servicos,
          cliente: { ...cliente.dataValues },
          totalOs,
          totalMecanico,
        };
      }
    );

    return ordensServicos;
  }

  private async allOrdemServicos(
    condition?: WhereOptions<InferAttributes<IOrdemServico>>
  ) {
    const ordens = await OrdemServicoModel.findAll({
      where: condition,
      subQuery: false,
      attributes: {
        exclude: [
          `${OrdemServicoModel.getAttributes().clienteId?.field}`,
          `${OrdemServicoModel.getAttributes().mecanicoId.field}`,
          `${OrdemServicoModel.getAttributes().createdAt?.field}`,
          `${OrdemServicoModel.getAttributes().updatedAt?.field}`,
        ],
      },
      order: [["dataExecucao", "desc"]],
      include: [
        {
          model: MecanicoModel,
          required: true,
        },
        { model: ClienteModel, required: true },
        {
          model: ServicoModel,
        },
      ],
    });

    const servicos = await OsServicosModel.findAll({
      where: {
        OrdemServicoId: { [Op.in]: ordens.map((os) => os.idOrdemServico) },
      },
      attributes: {
        include: [
          [
            this.conection.literal(
              `("osServico".valor_servico * servico.porcentagem)`
            ),
            "valorPorcentagem",
          ],
        ],
      },
      include: [
        {
          model: ServicoModel,
          required: true,
          association: new HasOne(OsServicosModel, ServicoModel, {
            foreignKey: "idServico",
            sourceKey: "ServicoId",
          }),
        },
      ],
    });

    const ordensWIthAllServicos = ordens.map((o) => {
      const servicosOrdem = servicos
        .filter((s) => s.OrdemServicoId === o.idOrdemServico)
        .map((s: any) => {
          const { servico: serv, ...another } = s;
          const { servico, ...osServico } = another.dataValues;
          return { ...serv.dataValues, osServico };
        });

      return { ...o.dataValues, servicos: servicosOrdem };
    });

    return ordensWIthAllServicos;
  }

  async getAll({
    user,
    clienteId,
    includeTotais,
    mecanicoId,
    dtFim,
    dtInicio,
  }: {
    user: string;
    mecanicoId?: number;
    clienteId?: number;
    includeTotais?: boolean;
    dtInicio?: string;
    dtFim?: string;
  }) {
    try {
      const condition: WhereOptions<InferAttributes<IOrdemServico>> = {
        mecanicoId,
        clienteId,
        usuario: user,
        dataExecucao: {
          [Op.and]: {
            [Op.gte]: dtInicio,
            [Op.lte]: dtFim,
          },
        },
      };

      if (!mecanicoId) delete condition.mecanicoId;
      if (!clienteId) delete condition.clienteId;
      if (!dtInicio || !dtFim) delete condition.dataExecucao;

      const ordensServicos = await this.allOrdemServicos(condition);

      await this.closeConection();

      if (includeTotais && ordensServicos.length > 0) {
        const ordensComTotais = this.mapperGetAll(ordensServicos);
        const mapTotais = ordensComTotais.map(({ totalOs, totalMecanico }) => ({
          totalOs: Number(totalOs),
          totalMecanico: Number(totalMecanico),
        }));

        let somaTotalOs: {
          totalOs: number;
          totalMecanico: number;
        } = {
          totalOs: 0,
          totalMecanico: 0,
        };

        if (mapTotais.length > 1) {
          somaTotalOs = mapTotais.reduce((a, b) => {
            const totalOs = a.totalOs + b.totalOs;
            const totalMecanico = a.totalMecanico + b.totalMecanico;
            return { totalOs, totalMecanico };
          });
        }

        if (mapTotais.length === 1) {
          somaTotalOs = {
            totalOs: mapTotais[0].totalOs,
            totalMecanico: mapTotais[0].totalMecanico,
          };
        }

        return {
          totalOrdens: ordensComTotais.length,
          totalServicos: ordensComTotais
            .map((ordem) => ordem.servicos.length)
            .reduce((a, b) => a + b),
          ...somaTotalOs,
          ordensServicos: ordensComTotais,
        };
      }

      return { ordensServicos };
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async create({
    mecanico,
    servicos,
    cliente,
    user,
  }: {
    mecanico: string;
    servicos: IServico[];
    cliente: ICliente;
    user: string;
  }) {
    const transacao = await this.conection.transaction();
    try {
      const idsMecanicoAndServicos = {} as IOsServicoPost;
      idsMecanicoAndServicos.user = user;

      const [findOrCreateMecanicoByName] = await MecanicoModel.findCreateFind({
        where: { nome: mecanico, usuario: user },
        transaction: transacao,
      });
      idsMecanicoAndServicos.mecanicoId = findOrCreateMecanicoByName.idMecanico;

      const { contato, nome, placa } = cliente;
      const [findOrCreateClienteByName] = await ClienteModel.findCreateFind({
        where: { contato, nome, placa, usuario: user },
        transaction: transacao,
      });
      idsMecanicoAndServicos.clienteId = findOrCreateClienteByName.idCliente;

      const servicosIds: ServicosRelationOS[] = [];
      for await (const { servico, valor } of servicos) {
        const servicoFinded = await ServicoModel.findOne({
          where: { servico },
        });

        let servicoToInclude = servicoFinded;

        if (!servicoToInclude) {
          servicoToInclude = await ServicoModel.create({
            servico,
            valor: +valor,
            usuario: user,
          });
        }

        servicosIds.push({
          idServico: servicoToInclude.idServico,
          valor: +valor,
        });
      }
      idsMecanicoAndServicos.servicosIdValor = servicosIds;

      return await this.createOSWithMecanicoClienteServicos({
        iOsServicoPost: idsMecanicoAndServicos,
        transaction: transacao,
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  private async createOSWithMecanicoClienteServicos({
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
      const dataExecucao = moment().format("YYYY-MM-DD");
      const ordemServicoCriada = await OrdemServicoModel.create(
        {
          dataExecucao,
          mecanicoId: iOsServicoPost.mecanicoId,
          clienteId: iOsServicoPost.clienteId,
          usuario: iOsServicoPost.user,
        },
        { transaction: transacao }
      );

      for await (let id of iOsServicoPost.servicosIdValor) {
        await OsServicosModel.create(
          {
            OrdemServicoId: ordemServicoCriada.idOrdemServico,
            ServicoId: id.idServico,
            valor: id.valor,
            usuario: iOsServicoPost.user,
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

  async addServicosInOs({ idOrdemServico, servicos, usuario }: ServicosAddOs) {
    /*
    buscar todos os serviços que existem com os servicos recebidos
    cria uma lista de servicos recebidos com id dos servicos encontrados
    cria uma lista de servicos não encontrados
    se servicos não encontrados for maior que 0 cria os servicos não encontrados e substitui a lista de servicos não encontrados pelos novos servicos
    cria uma lista com todos os servicos mapeados para incluir na ordem de servico
    inclui servicos na ordem de servico
    */

    const transacao = await this.conection.transaction();

    try {
      const servicosFinded = await ServicoModel.findAll({
        where: {
          usuario: usuario,
          servico: {
            [Op.in]: servicos.map((ser) => ser.servico),
          },
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "valor"],
        },
        transaction: transacao,
      });

      const servicosWithIdFromServicosFinded = servicos
        .filter((ser) =>
          servicosFinded.map(({ servico }) => servico).includes(ser.servico)
        )
        .map(({ servico, valor }) => ({
          idServico: servicosFinded.find(
            (servicoFind) => servicoFind.servico === servico
          )?.idServico,
          valor,
        }));

      let servicosNotFinded = servicos.filter(
        (serv) =>
          !servicosFinded.map(({ servico }) => servico).includes(serv.servico)
      );

      if (servicosNotFinded.length > 0) {
        servicosNotFinded = await new ServicoService(this.conection).createMany(
          {
            servicos: servicosNotFinded,
            usuario: usuario!,
            transaction: transacao,
          }
        );
      }

      const allServicosMappedWithOrdemServicoId = [
        ...servicosWithIdFromServicosFinded,
        ...servicosNotFinded,
      ].map(({ valor, idServico }) => ({
        valor: +valor,
        ServicoId: Number(idServico),
        OrdemServicoId: idOrdemServico,
        usuario,
      }));

      const addServicosInOs = await OsServicosModel.bulkCreate(
        allServicosMappedWithOrdemServicoId,
        { transaction: transacao }
      );
      await transacao.commit();
      await this.closeConection();

      return addServicosInOs;
    } catch (error) {
      await transacao.rollback();
      throw error;
    }
  }

  async removeServicoInOs(idOsServicos: number) {
    try {
      return await OsServicosModel.destroy({
        where: {
          idOsServicos,
        },
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async closeOrReopenOS({ idOs, status }: { idOs: number; status: number }) {
    try {
      await OrdemServicoModel.update(
        { status },
        { where: { idOrdemServico: idOs } }
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getAllAbertos(user: string) {
    try {
      const ordens = await this.allOrdemServicos({ status: 1, usuario: user });

      return { ordensServicos: ordens };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
