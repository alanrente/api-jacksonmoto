import { Request, Response } from "express";
import sendBodyFormatter from "../utils/sendBodyFormatter";
import { ServicoService } from "../services/servico.service";

export const ServicoController = {
  async getAll(req: Request, res: Response) {
    try {
      const result = await new ServicoService().getAll();
      return res.send(sendBodyFormatter(result, "body"));
    } catch (error: any) {
      console.log(error);
      return res.send(sendBodyFormatter(error.message));
    }
  },
};
