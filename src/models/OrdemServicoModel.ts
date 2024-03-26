import { DataTypes } from "sequelize";
import database from "../infra/database";
const sequelize = database();

const OrdemServicoModel = sequelize.define(
  "OrdemServicoModel",
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
    tableName: "ORDEM_SERVICO_TB",
    defaultScope: {
      order: ["idOrdemServico"],
    },
  }
);

export { OrdemServicoModel };
