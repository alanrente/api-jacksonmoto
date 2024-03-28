import { Request, Response } from "express";
import sendBodyFormatter from "../utils/sendBodyFormatter";
import { OrdemServicoService } from "../services/ordemServicoService.service";
import { IServico } from "../interfaces/OrdemServico.interface";

export const OrdemServicoController = {
  async getAll(req: Request, res: Response) {
    try {
      const { mecanicoId } = req.query as { mecanicoId: string };
      const result = await new OrdemServicoService().getAll(+mecanicoId);
      return res.send(sendBodyFormatter(result, "body"));
    } catch (error: any) {
      console.log(error);
      return res.send(sendBodyFormatter(error.message));
    }
  },

  async create(req: Request, res: Response) {
    try {
      console.log(req.body);
      const body = req.body as { servicos: IServico[]; mecanico: string };
      const result = await new OrdemServicoService().create(body);
      return res.send(sendBodyFormatter(result, "body"));
    } catch (error: any) {
      console.log(error);
      return res.send(sendBodyFormatter(error.message));
    }
  },
};
