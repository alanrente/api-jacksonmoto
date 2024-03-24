import { DataTypes, Model, Sequelize } from "sequelize";
import database from "../infra/database";

export class OrdemServicoModel extends Model {
  declare idOrdemServico?: number;
}

export const getOrdemServicoModel = (conexao: Sequelize) => {
  OrdemServicoModel.init(
    {
      idOrdemServico: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: true,
      },
      dataExecucao: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
      },
      mecanicoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      servicoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize: database(),
      tableName: "ORDEM_SERVICO_TB",
      defaultScope: {
        order: ["idOrdemServico"],
      },
    }
  );

  return OrdemServicoModel;
};
