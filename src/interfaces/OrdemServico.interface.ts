export interface ServicosRlOS {
  idServico: number;
  valor?: number;
}

export interface IOsServicoPost {
  servicosIdValor: ServicosRlOS[];
  mecanicoId: number;
  clienteId: number;
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
