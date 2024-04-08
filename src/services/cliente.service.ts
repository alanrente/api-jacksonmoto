import conexao from "../infra/database";
import { Sequelize } from "sequelize";
import { Conection } from "../interfaces/Conection.interface";
import database from "../infra/database";
// import { ClienteModel } from "../models/ClienteModel";

export class ClienteService extends Conection {
  constructor() {
    super(database());
  }

  async getAll() {
    // const clientes = await this.clienteModel.findAll();
    await this.closeConection();
    return ["clientes"];
  }
}
