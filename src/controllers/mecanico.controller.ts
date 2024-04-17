import { Request, Response } from "express";
import { MecanicoService } from "../services/mecanico.service";
import sendBodyFormatter from "../utils/sendBodyFormatter";

export const MecanicoController = {
  async getAll(req: Request, res: Response) {
    try {
      const result = await new MecanicoService().getAll();
      return res.send(sendBodyFormatter(result, "body"));
    } catch (error: any) {
      console.log(error);
      return res.send(sendBodyFormatter(error.message));
    }
  },
};