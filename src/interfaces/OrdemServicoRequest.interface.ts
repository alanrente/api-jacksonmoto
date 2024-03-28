export interface IOsServicoPost {
  servicosId: number[];
  mecanicoId: number;
}

export interface IServico {
  servico: string;
  valor: number | string;
}

export interface IMecanico {
  nome: string;
}
