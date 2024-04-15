import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Optional,
} from "sequelize";
import { MakeNullishOptional } from "sequelize/types/utils";

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
  clienteId?: number;
}
export interface ICliente
  extends Model<InferAttributes<ICliente>, InferCreationAttributes<ICliente>> {
  idCliente: CreationOptional<number>;
  nome?: string;
  placa?: number;
  contato?: number;
}

export interface IOsServicos
  extends Model<
    InferAttributes<IOsServicos>,
    InferCreationAttributes<IOsServicos>
  > {
  ServicoId: number;
  OrdemServicoId: number;
  valor?: number;
}

export interface IServicoModel
  extends Model<
    InferAttributes<IServicoModel>,
    InferCreationAttributes<IServicoModel>
  > {
  idServico: CreationOptional<number>;
  servico: string;
  valor: number;
}

export interface IMecanicoModel
  extends Model<
    InferAttributes<IMecanicoModel>,
    InferCreationAttributes<IMecanicoModel>
  > {
  idMecanico: CreationOptional<number>;
  nome: string;
}
