import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

export interface Usuario {
  usuario?: string;
}
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
    >,
    Usuario {
  idOrdemServico: CreationOptional<number>;
  dataExecucao: string;
  mecanicoId: number;
  clienteId?: number;
  status?: number;
  createdAt?: CreationOptional<Date>;
  updatedAt?: CreationOptional<Date>;
}
export interface ICliente
  extends Model<InferAttributes<ICliente>, InferCreationAttributes<ICliente>>,
    Usuario {
  idCliente: CreationOptional<number>;
  nome?: string;
  placa?: number;
  contato?: number;
  usuario?: string;
}

export interface IOsServicos
  extends Model<
      InferAttributes<IOsServicos>,
      InferCreationAttributes<IOsServicos>
    >,
    Usuario {
  idOsServicos?: number;
  ServicoId: number;
  OrdemServicoId: number;
  valor?: number;
}

export interface IServicoModel
  extends Model<
      InferAttributes<IServicoModel>,
      InferCreationAttributes<IServicoModel>
    >,
    Usuario {
  idServico: CreationOptional<number>;
  servico: string;
  valor: number;
  porcentagem?: CreationOptional<number>;
  valorPorcentagem?: number;
}
