import { DataTypes } from "sequelize";
import database from "../infra/database";
import { ICliente } from "../interfaces/Models.interface";
const sequelize = database();

export const ClienteModel = sequelize.define<ICliente>(
  "cliente",
  {
    idCliente: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      field: "id_cliente",
    },
    nome: { type: DataTypes.STRING, field: "nome" },
    placa: { type: DataTypes.STRING(10), field: "placa" },
    contato: { type: DataTypes.STRING, field: "contato" },
    usuario: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "CLIENTE_TB",
    defaultScope: {
      order: ["idCliente"],
    },
    createdAt: false,
    updatedAt: false,
  }
);
