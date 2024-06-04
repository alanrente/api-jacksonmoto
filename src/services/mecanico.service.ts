import conexao from "../infra/database";
import { Sequelize, Transaction } from "sequelize";
import { MecanicoModel } from "../models/mecanico.model";
import {
  ZParamMecanico,
  ZMecanico,
  ZMecanicoType,
} from "../interfaces/Mecanico.interface";
import { Conection } from "../interfaces/Conection.interface";
import { z } from "zod";

export class MecanicoService extends Conection {
  private mecanicoModel: typeof MecanicoModel;

  constructor(anotherConection?: Sequelize) {
    const conection = anotherConection ? anotherConection : conexao();
    super(conection);

    this.mecanicoModel = MecanicoModel;
  }

  async getAll(user: string) {
    const mecanicos = await this.mecanicoModel.findAll({
      where: {
        usuario: user,
      },
    });
    await this.closeConection();
    return mecanicos;
  }

  async findOne({
    idMecanico,
    usuario,
  }: {
    idMecanico: number;
    usuario: string;
  }) {
    const mecanico = await this.mecanicoModel.findOne({
      where: { idMecanico, usuario },
    });
    await this.closeConection();

    return mecanico;
  }

  async findOrCreateMecanicoByName({
    nome,
    usuario,
    transaction,
  }: {
    nome: string;
    usuario: string;
    transaction?: Transaction;
  }) {
    const result = await z
      .object({
        nome: z.string(),
        usuario: z.string(),
      })
      .safeParseAsync({ nome, usuario });

    if (!result.success) {
      throw new Error(result.error.issues[0].message);
    }

    const mecanicoFinded = await this.mecanicoModel.findOne({
      where: { nome, usuario },
      transaction,
    });

    if (mecanicoFinded) return mecanicoFinded;

    return await this.create({
      usuario,
      transaction,
      mecanico: { nome: nome },
    });
  }

  private createCodigo() {
    return (Math.random() * (999999 - 100000 + 1) + 100000)
      .toFixed()
      .padStart(6, "0");
  }

  private async findOneByCodigo(codigo: string) {
    return await this.mecanicoModel.findOne({ where: { codigo } });
  }
  async create({
    mecanico,
    usuario,
    transaction,
  }: {
    mecanico: ZMecanicoType;
    usuario: string;
    transaction?: Transaction;
  }) {
    let codigo = this.createCodigo(),
      mecanicoByCod = await this.findOneByCodigo(codigo);

    while (mecanicoByCod) {
      codigo = this.createCodigo();
      mecanicoByCod = await this.findOneByCodigo(codigo);
    }

    return await this.mecanicoModel.create(
      { nome: mecanico.nome, usuario, codigo },
      { transaction }
    );
  }

  async update({
    idMecanico,
    mecanico,
    usuario,
  }: {
    idMecanico: number;
    usuario: string;
    mecanico: ZMecanicoType;
  }) {
    return await this.mecanicoModel.update(mecanico, {
      where: { idMecanico, usuario },
    });
  }
}
