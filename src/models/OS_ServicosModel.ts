import { DataTypes } from "sequelize";
import database from "../infra/database";
import { ServicoModel } from "./ServicoModel";
import { OrdemServicoModel } from "./OrdemServicoModel";
import { IOsServicos } from "../interfaces/Models.interface";

const OS_ServicosModel = database().define<IOsServicos>(
  "OS_ServicosModel",
  {
    ServicoId: {
      type: DataTypes.INTEGER,
      references: {
        model: ServicoModel,
        key: ServicoModel.primaryKeyAttribute,
      },
    },
    OrdemServicoId: {
      type: DataTypes.INTEGER,
      references: {
        model: OrdemServicoModel,
        key: OrdemServicoModel.primaryKeyAttribute,
      },
    },
  },
  { tableName: "OS_SERVICOS" }
);

export { OS_ServicosModel };
