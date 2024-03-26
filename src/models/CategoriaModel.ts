import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import database from "../infra/database";
const sequelize = database();

interface CategoriaModel
  extends Model<
    InferAttributes<CategoriaModel>,
    InferCreationAttributes<CategoriaModel>
  > {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  categoriaId?: CreationOptional<number>;
  categoria: string;
}

export const CategoriaModel = sequelize.define<CategoriaModel>(
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
