import conexao from "../infra/database";
import { Sequelize } from "sequelize";
import { Conection } from "../interfaces/Conection.interface";
import database from "../infra/database";
import { ClienteModel } from "../models/cliente.model";

export class ClienteService extends Conection {
  clienteModel: typeof ClienteModel;
  constructor() {
    super(database());
    this.clienteModel = ClienteModel;
  }

  async getAll(usuario: string) {
    const clientes = await this.clienteModel.findAll({
      where: { usuario },
    });
    await this.closeConection();
    return clientes;
  }
}
