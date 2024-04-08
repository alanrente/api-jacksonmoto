import { DataTypes } from "sequelize";
import database from "../infra/database";
import { ServicoModel } from "./servico.model";
import { OrdemServicoModel } from "./ordemServico.model";
import { IOsServicos } from "../interfaces/Models.interface";

const OsServicosModel = database().define<IOsServicos>(
  "osServico",
  {
    ServicoId: {
      type: DataTypes.INTEGER,
      field: "servico_id",
    },
    OrdemServicoId: {
      type: DataTypes.INTEGER,
      field: "ordem_servico_id",
    },
  },
  {
    tableName: "OS_SERVICOS_TB",
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
  }
);

ServicoModel.belongsToMany(OrdemServicoModel, {
  through: OsServicosModel,
  foreignKey: OsServicosModel.getAttributes().ServicoId,
});

OrdemServicoModel.belongsToMany(ServicoModel, {
  through: OsServicosModel,
  foreignKey: OsServicosModel.getAttributes().OrdemServicoId,
});

export { OsServicosModel };
