import moment from "moment";
import conexao from "../infra/database";
import { Conection } from "../interfaces/Conection.interface";
import { MecanicoModel } from "../models/mecanico.model";
import { OsServicosModel } from "../models/oSServicos.model";
import { OrdemServicoModel } from "../models/ordemServico.model";
import {
  IOSMapper,
  IOsServicoPost,
  IServico,
  ServicosAddOs,
  ServicosRelationOS,
} from "../interfaces/OrdemServico.interface";
import { ServicoModel } from "../models/servico.model";
import { InferAttributes, Op, Transaction, WhereOptions } from "sequelize";
import { ICliente, IOrdemServico } from "../interfaces/Models.interface";
import { ClienteModel } from "../models/cliente.model";
import { ServicoService } from "./servico.service";

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
      retorno.idCliente = os.ClienteModel.idCliente;
      retorno.nomeCliente = os.ClienteModel.nome;
      retorno.placa = os.ClienteModel.placa;
      retorno.contato = os.ClienteModel.contato;
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

  async getAll(mecanicoId?: number, clienteId?: number) {
    try {
      const condition: WhereOptions<InferAttributes<IOrdemServico>> = {
        mecanicoId,
        clienteId,
      };

      if (!mecanicoId) delete condition.mecanicoId;
      if (!clienteId) delete condition.clienteId;

      const ordensServicos = await OrdemServicoModel.findAll({
        where: condition,
        include: [
          {
            model: MecanicoModel,
            required: true,
          },
          { model: ClienteModel, required: true },
          {
            model: ServicoModel,
            attributes: {
              include: [
                `${ServicoModel.getAttributes().servico.field}`,
                `${ServicoModel.getAttributes().valor.field}`,
              ],
            },
          },
        ],
      });

      await this.closeConection();

      if (ordensServicos.length == 0) return ordensServicos;

      return ordensServicos;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async create({
    mecanico,
    servicos,
    cliente,
  }: {
    mecanico: string;
    servicos: IServico[];
    cliente: ICliente;
  }) {
    const transacao = await this.conection.transaction();
    try {
      const idsMecanicoAndServicos = {} as IOsServicoPost;

      const [findOrCreateMecanicoByName] = await MecanicoModel.findCreateFind({
        where: { nome: mecanico },
        transaction: transacao,
      });
      idsMecanicoAndServicos.mecanicoId = findOrCreateMecanicoByName.idMecanico;

      const { contato, nome, placa } = cliente;
      const [findOrCreateClienteByName] = await ClienteModel.findCreateFind({
        where: { contato, nome, placa },
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
      const dataExecucao = moment().format("YYYY-MM-25");
      const ordemServicoCriada = await OrdemServicoModel.create(
        {
          dataExecucao,
          mecanicoId: iOsServicoPost.mecanicoId,
          clienteId: iOsServicoPost.clienteId,
        },
        { transaction: transacao }
      );

      for await (let id of iOsServicoPost.servicosIdValor) {
        await OsServicosModel.create(
          {
            OrdemServicoId: ordemServicoCriada.idOrdemServico,
            ServicoId: id.idServico,
            valor: id.valor,
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

  async addServicosInOs({ idOrdemServico, servicos }: ServicosAddOs) {
    /*
    buscar todos os serviços que existem com os servicos recebidos
    cria uma lista de servicos recebidos com id dos servicos encontrados
    cria uma lista de servicos não encontrados
    se servicos não encontrados for maior que 0 cria os servicos não encontrados e substitui a lista de servicos não encontrados pelos novos servicos
    cria uma lista com todos os servicos mapeados para incluir na ordem de servico
    inclui servicos na ordem de servico
    */
    const servicosFinded = await ServicoModel.findAll({
      where: {
        servico: {
          [Op.in]: servicos.map((ser) => ser.servico),
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "valor"],
      },
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
        servicosNotFinded
      );
    }

    const allServicosMappedWithOrdemServicoId = [
      ...servicosWithIdFromServicosFinded,
      ...servicosNotFinded,
    ].map(({ valor, idServico }) => ({
      valor: +valor,
      ServicoId: Number(idServico),
      OrdemServicoId: idOrdemServico,
    }));

    const addServicosInOs = await OsServicosModel.bulkCreate(
      allServicosMappedWithOrdemServicoId
    );
    await this.closeConection();

    return addServicosInOs;
  }
}
