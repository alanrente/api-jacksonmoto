import { Request, Response } from "express";
import sendBodyFormatter from "../utils/sendBodyFormatter";
import { ServicoService } from "../services/servico.service";
import MyCipher from "../utils/crypto.util";

export const ServicoController = {
  async getAll(req: Request, res: Response) {
    try {
      const { user } = new MyCipher().myTokenAsUser(req.headers.authorization!);

      const result = await new ServicoService().getAll(user);
      return res.send(sendBodyFormatter(result, "body"));
    } catch (error: any) {
      console.log(error);
      return res.send(sendBodyFormatter(error.message));
    }
  },
};
