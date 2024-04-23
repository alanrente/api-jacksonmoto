import { Request, Response } from "express";
import { MecanicoService } from "../services/mecanico.service";
import sendBodyFormatter from "../utils/sendBodyFormatter";
import MyCipher from "../utils/crypto.util";

export const MecanicoController = {
  async getAll(req: Request, res: Response) {
    try {
      const user = new MyCipher().myTokenAsUser(`${req.headers.authorization}`);
      const result = await new MecanicoService().getAll(user.user);
      return res.send(sendBodyFormatter(result, "body"));
    } catch (error: any) {
      console.log(error);
      return res.send(sendBodyFormatter(error.message));
    }
  },
};
