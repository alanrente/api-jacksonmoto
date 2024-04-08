import { DataTypes } from "sequelize";
import database from "../infra/database";
const sequelize = database();

export const ClienteModel = sequelize.define(
  "ClienteModel",
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
