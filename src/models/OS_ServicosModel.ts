import { DataTypes } from "sequelize";
import database from "../infra/database";
import { ServicoModel } from "./ServicoModel";
import { OrdemServicoModel } from "./OrdemServicoModel";
import { IOsServicos } from "../interfaces/Models.interface";

const OsServicosModel = database().define<IOsServicos>(
  "OsServicosModel",
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
  { tableName: "OS_SERVICOS_TB", freezeTableName: true }
);

ServicoModel.belongsToMany(OrdemServicoModel, {
  through: OsServicosModel,
  foreignKey: OsServicosModel.getAttributes().ServicoId,
});

OrdemServicoModel.belongsToMany(ServicoModel, {
  through: OsServicosModel,
  foreignKey: OsServicosModel.getAttributes().OrdemServicoId,
});

// OsServicosModel.hasMany(OrdemServicoModel, {
//   foreignKey: OrdemServicoModel.getAttributes().idOrdemServico,
// });
// OsServicosModel.hasMany(ServicoModel, {
//   foreignKey: ServicoModel.getAttributes().idServico,
// });

export { OsServicosModel as OS_ServicosModel };
