import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

export interface ICategoriaModel
  extends Model<
    InferAttributes<ICategoriaModel>,
    InferCreationAttributes<ICategoriaModel>
  > {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  categoriaId?: CreationOptional<number>;
  categoria: string;
}

export interface IOrdemServico
  extends Model<
    InferAttributes<IOrdemServico>,
    InferCreationAttributes<IOrdemServico>
  > {
  idOrdemServico: CreationOptional<number>;
  dataExecucao: string;
  mecanicoId: number;
}

export interface IOsServicos
  extends Model<
    InferAttributes<IOsServicos>,
    InferCreationAttributes<IOsServicos>
  > {
  ServicoId: number;
  OrdemServicoId: number;
}
