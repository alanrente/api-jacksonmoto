import { DataTypes } from "sequelize";
import database from "../infra/database";
import { IMecanicoModel } from "../interfaces/Models.interface";
const sequelize = database();

const MecanicoModel = sequelize.define<IMecanicoModel>(
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
  },
  {
    tableName: "MECANICO_TB",
    defaultScope: {
      order: ["idMecanico"],
    },
  }
);

export { MecanicoModel };
