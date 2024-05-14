import { Request, Response } from "express";
import sendBodyFormatter from "../utils/sendBodyFormatter";
import { OrdemServicoService } from "../services/ordemServicoService.service";
import { IServico } from "../interfaces/OrdemServico.interface";
import { ICliente } from "../interfaces/Models.interface";
import MyCipher from "../utils/crypto.util";

export const OrdemServicoController = {
  async getAll(req: Request, res: Response) {
    try {
      const { mecanicoId, clienteId, includeTotais, dtFim, dtInicio } =
        req.query as {
          mecanicoId: string;
          clienteId: string;
          includeTotais: string;
          dtFim: string;
          dtInicio: string;
        };

      const result = await new OrdemServicoService().getAll({
        user: new MyCipher().myTokenAsUser(`${req.headers.authorization}`).user,
        mecanicoId: +mecanicoId,
        clienteId: +clienteId,
        includeTotais: includeTotais == "" || includeTotais == "true",
        dtFim,
        dtInicio,
      });

      return res.send(sendBodyFormatter(result, "body"));
    } catch (error: any) {
      console.log(error);
      return res.status(500).send(sendBodyFormatter(error.message));
    }
  },

  async createOSWithServicosMecanicoAndCliente(req: Request, res: Response) {
    try {
      const body = req.body as {
        servicos: IServico[];
        mecanico: string;
        cliente: ICliente;
        user: string;
      };

      body.user = new MyCipher().myTokenAsUser(
        `${req.headers.authorization}`
      ).user;

      const result = await new OrdemServicoService().create(body);
      return res.send(sendBodyFormatter(result, "body"));
    } catch (error: any) {
      console.log(error);
      return res.status(500).send(sendBodyFormatter(error.message));
    }
  },

  async addServicosInOs(req: Request, res: Response) {
    try {
      const { user } = new MyCipher().myTokenAsUser(req.headers.authorization!);
      req.body = { ...req.body, usuario: user };

      await new OrdemServicoService().addServicosInOs(req.body);
      res.send();
    } catch (error: any) {
      res.status(500).send(sendBodyFormatter(error.message));
    }
  },

  async closeOrReopen(req: Request, res: Response) {
    try {
      const { status } = req.body as { status: number };
      const { id } = req.params as { id: string };

      const osService = new OrdemServicoService();

      await osService.closeOrReopenOS({ idOs: +id, status });

      const msgCloseOrReopenOS = [`OS: ${id} fechada!`, `OS: ${id} reaberta!`];

      res.send(sendBodyFormatter(msgCloseOrReopenOS[status]));
    } catch (error: any) {
      res.status(500).send(sendBodyFormatter(error.message));
    }
  },

  async getAllAbertos(req: Request, res: Response) {
    try {
      const abertos = await new OrdemServicoService().getAllAbertos();
      res.send(sendBodyFormatter(abertos, "body"));
    } catch (error: any) {
      res.status(500).send(sendBodyFormatter(error.message));
    }
  },
};
