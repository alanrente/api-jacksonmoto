import { DataTypes } from "sequelize";
import database from "../infra/database";
import { IOrdemServico } from "../interfaces/Models.interface";
import { OS_ServicosModel } from "./OS_ServicosModel";
import { ServicoModel } from "./ServicoModel";
const sequelize = database();

const OrdemServicoModel = sequelize.define<IOrdemServico>(
  "ordemServico",
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
  },
  {
    tableName: "ORDEM_SERVICO_TB",
    defaultScope: {
      order: ["idOrdemServico"],
    },
  }
);

export { OrdemServicoModel };
