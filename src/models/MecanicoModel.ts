import { DataTypes } from "sequelize";
import database from "../infra/database";
const sequelize = database();

export const MecanicoModel = sequelize.define(
  "MecanicoModel",
  {
    idMecanico: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
    },
    nome: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "MECANICO_TB",
    defaultScope: {
      order: ["idMecanico"],
    },
  }
);
