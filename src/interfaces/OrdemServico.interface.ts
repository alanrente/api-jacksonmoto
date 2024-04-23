import { Usuario } from "./Models.interface";

export interface ServicosRelationOS {
  idServico: number;
  valor?: number;
}

export interface IOsServicoPost {
  servicosIdValor: ServicosRelationOS[];
  mecanicoId: number;
  clienteId: number;
  user: string;
}

export interface IServico {
  idServico?: number;
  servico: string;
  valor: number | string;
}

export interface IMecanico {
  nome: string;
}

export interface IOSMapper {
  idOrdemServico: number;
  idCliente: number;
  nomeCliente: string;
  placa: string;
  contato: string;
  dataExecucao: string;
  idMecanico: number;
  nomeMecanico: string;
  servicos: IServico[];
  totalOS: number;
  totalMecanico: number;
}

export type ServicosAddOs = Usuario & {
  servicos: IServico[];
  idOrdemServico: number;
};
