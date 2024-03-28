import { Request, Response } from "express";
import sendBodyFormatter from "../utils/sendBodyFormatter";
import { OrdemServicoService } from "../services/ordemServicoService.service";
import { IServico } from "../interfaces/OrdemServico.interface";

export const OrdemServicoController = {
  async getAll(req: Request, res: Response) {
    try {
      const { mecanicoId } = req.query as { mecanicoId: string };
      const result = await new OrdemServicoService().getAll(+mecanicoId);

      if (result.ordensServicos.length == 0)
        return res
          .status(404)
          .send(sendBodyFormatter("nenhum registro encontrado"));

      return res.send(sendBodyFormatter(result, "body"));
    } catch (error: any) {
      console.log(error);
      return res.status(500).send(sendBodyFormatter(error.message));
    }
  },

  async create(req: Request, res: Response) {
    try {
      const body = req.body as { servicos: IServico[]; mecanico: string };
      const result = await new OrdemServicoService().create(body);
      return res.send(sendBodyFormatter(result, "body"));
    } catch (error: any) {
      console.log(error);
      return res.status(500).send(sendBodyFormatter(error.message));
    }
  },
};
