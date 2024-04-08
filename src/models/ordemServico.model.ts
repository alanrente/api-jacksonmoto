import { DataTypes } from "sequelize";
import database from "../infra/database";
import { IOrdemServico } from "../interfaces/Models.interface";
import { MecanicoModel } from "./mecanico.model";
import { ClienteModel } from "./cliente.model";
const sequelize = database();

const OrdemServicoModel = sequelize.define<IOrdemServico>(
  "OrdemServico",
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
    clienteId: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    tableName: "ORDEM_SERVICO_TB",
    defaultScope: {
      order: ["idOrdemServico"],
    },
  }
);

OrdemServicoModel.belongsTo(MecanicoModel, { foreignKey: "mecanicoId" });
OrdemServicoModel.belongsTo(ClienteModel, { foreignKey: "clienteId" });

export { OrdemServicoModel };
