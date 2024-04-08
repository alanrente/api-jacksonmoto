import { Request, Response } from "express";
import { ClienteService } from "../services/cliente.service";
import sendBodyFormatter from "../utils/sendBodyFormatter";

export const ClienteController = {
  async getAll(req: Request, res: Response) {
    try {
      const result = await new ClienteService().getAll();
      return res.send(sendBodyFormatter(result, "body"));
    } catch (error: any) {
      console.log(error);
      return res.send(sendBodyFormatter(error.message));
    }
  },
};