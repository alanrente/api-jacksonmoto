import { Request, Response } from "express";
import sendBodyFormatter from "../utils/sendBodyFormatter";
import { ServicoService } from "../services/servico.service";
import MyCipher from "../services/crypto.service";
import { IServico } from "../interfaces/OrdemServico.interface";

export class ServicoController {
  async getAll(req: Request, res: Response) {
    try {
      const { user } = new MyCipher().myTokenAsUser(req.headers.authorization!);

      const result = await new ServicoService().getAll(user);
      return res.send(sendBodyFormatter(result, "body"));
    } catch (error: any) {
      console.log(error);
      return res.send(sendBodyFormatter(error.message));
    }
  }

  async update(req: Request, res: Response) {
    const servico = req.body as IServico;
    const { idServico } = req.params as { idServico: string };

    try {
      const id = Number(idServico);

      const servicoUpdated = await new ServicoService().update({
        idServico: id,
        servico,
      });

      res.send(servicoUpdated);
    } catch (error: any) {
      res.status(400).send(error);
    }
  }
}
