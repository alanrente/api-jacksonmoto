import { DataTypes, Model, Sequelize } from "sequelize";

async function getCategoriaModel(sequelize: Sequelize) {
  class CategoriaModel extends Model {
    declare categoriaId?: number;
    declare categoria: string;
  }
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
    { sequelize, tableName: "CATEGORIA_TB" }
  );

  return CategoriaModel;
}

export default getCategoriaModel;
