import { DataTypes, Model, Sequelize } from "sequelize";
import database from "../infra/database";

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
  {
    sequelize: database(),
    tableName: "CATEGORIA_TB",
    defaultScope: {
      order: ["categoriaId"],
    },
  }
);

export default CategoriaModel;
