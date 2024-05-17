import { z } from "zod";
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

// export interface IServico {
//   idServico?: number;
//   servico: string;
//   valor: number | string;
//   porcentagem?: number;
//   valorPorcentagem?: number;
// }

export const ZServico = z.object({
  idServico: z.number().min(0).optional(),
  servico: z.string(),
  valor: z.number(),
  porcentagem: z.number().min(0).max(1).optional(),
  valorPorcentagem: z.number().optional(),
});

export type IServico = z.infer<typeof ZServico>;

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
