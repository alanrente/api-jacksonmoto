import { DataTypes } from "sequelize";
import database from "../infra/database";
const sequelize = database();

export const ServicoModel = sequelize.define(
  "ServicoModel",
  {
    idServico: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
    },
    servico: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    valor: {
      type: DataTypes.DECIMAL(16, 2),
      allowNull: false,
    },
  },
  {
    defaultScope: {
      order: ["idServico"],
    },
    tableName: "SERVICO_TB",
  }
);
