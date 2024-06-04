import { DataTypes } from "sequelize";
import database from "../infra/database";
import { IMec } from "../interfaces/Mecanico.interface";

const sequelize = database();

const MecanicoModel = sequelize.define<IMec>(
  "mecanico",
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
    usuario: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER({ precision: 4 }),
      allowNull: false,
      defaultValue: 1,
    },
    codigo: {
      type: DataTypes.CHAR(6),
      unique: true,
    },
  },
  {
    createdAt: false,
    updatedAt: false,
    tableName: "MECANICO_TB",
    defaultScope: {
      order: ["idMecanico"],
    },
  }
);

export { MecanicoModel };
