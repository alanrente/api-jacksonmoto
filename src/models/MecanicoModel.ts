import { DataTypes, Model, Sequelize } from "sequelize";

export class MecanicoModel extends Model {
  declare idMecanico?: number;
  declare nome: string;
}

export const getMecanicoModel = (conexao: Sequelize) => {
  MecanicoModel.init(
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
      sequelize: conexao,
      tableName: "MECANICO_TB",
      defaultScope: {
        order: ["idMecanico"],
      },
    }
  );

  return MecanicoModel;
};
