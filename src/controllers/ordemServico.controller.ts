import { Request, Response } from "express";
import sendBodyFormatter from "../utils/sendBodyFormatter";
import { OrdemServicoService } from "../services/ordemServicoService.service";
import { IOsServicoPost } from "../interfaces/OrdemServicoRequest.interface";

export const OrdemServicoController = {
  async getAll(req: Request, res: Response) {
    try {
      const result = await new OrdemServicoService().getAll();
      return res.send(sendBodyFormatter(result, "body"));
    } catch (error: any) {
      console.log(error);
      return res.send(sendBodyFormatter(error.message));
    }
  },
  async create(req: Request, res: Response) {
    try {
      console.log(req.body);
      const { mecanicoId, servicosId } = req.body as IOsServicoPost;
      const ordemServico = await new OrdemServicoService().createOSServico({
        mecanicoId,
        servicosId,
      });
      res.send(sendBodyFormatter(ordemServico, "body"));
    } catch (error: any) {
      console.log(error);
      return res.send(sendBodyFormatter(error.message));
    }
  },
};
