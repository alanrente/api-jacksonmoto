import { Request, Response } from "express";
import sendBodyFormatter from "../utils/sendBodyFormatter";
import { User } from "../interfaces/Auth.interface";
import { AuthService } from "../services/auth.service";

export const AuthController = {
  async getUser(req: Request, res: Response) {
    try {
      const { senha, usuario } = req.body as User;
      const result = await new AuthService().getOneUser({ senha, usuario });

      return res.send(sendBodyFormatter({ chave: result }, "body"));
    } catch (error: any) {
      console.log(error);
      return res.status(500).send(sendBodyFormatter(error.message));
    }
  },
};
