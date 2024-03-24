import { DataTypes, Model, Sequelize } from "sequelize";
// import database from "../infra/database";
export class CategoriaModel extends Model {
  declare categoriaId?: number;
  declare categoria: string;
}

export const getCategoriaModel = (conexao: Sequelize) => {
  CategoriaModel.init(
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
      sequelize: conexao,
      tableName: "CATEGORIA_TB",
      defaultScope: {
        order: ["categoriaId"],
      },
    }
  );

  return CategoriaModel;
};
