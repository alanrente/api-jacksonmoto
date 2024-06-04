import { Request, Response } from "express";
import { ClienteService } from "../services/cliente.service";
import sendBodyFormatter from "../utils/sendBodyFormatter";
import MyCipher from "../services/crypto.service";

export const ClienteController = {
  async getAll(req: Request, res: Response) {
    try {
      const { user } = new MyCipher().myTokenAsUser(
        req.headers.authorization!.toString()
      );

      const result = await new ClienteService().getAll(user);
      return res.send(sendBodyFormatter(result, "body"));
    } catch (error: any) {
      console.log(error);
      return res.send(sendBodyFormatter(error.message));
    }
  },
};
