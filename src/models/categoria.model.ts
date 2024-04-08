import { DataTypes } from "sequelize";
import database from "../infra/database";
import { ICategoriaModel } from "../interfaces/Models.interface";
const sequelize = database();

export const CategoriaModel = sequelize.define<ICategoriaModel>(
  "CategoriaModel",
  {
    categoriaId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
    },
    categoria: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "CATEGORIA_TB",
    defaultScope: {
      order: ["categoriaId"],
    },
  }
);
