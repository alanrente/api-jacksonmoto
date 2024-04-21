import { Request, Response } from "express";
import sendBodyFormatter from "../utils/sendBodyFormatter";
import { OrdemServicoService } from "../services/ordemServicoService.service";
import { IServico } from "../interfaces/OrdemServico.interface";
import { ICliente } from "../interfaces/Models.interface";

export const OrdemServicoController = {
  async getAll(req: Request, res: Response) {
    try {
      const { mecanicoId, clienteId } = req.query as {
        mecanicoId: string;
        clienteId: string;
      };
      const result = await new OrdemServicoService().getAll(
        +mecanicoId,
        +clienteId
      );

      if (result.length == 0)
        return res
          .status(404)
          .send(sendBodyFormatter("nenhum registro encontrado"));

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
      };
      const result = await new OrdemServicoService().create(body);
      return res.send(sendBodyFormatter(result, "body"));
    } catch (error: any) {
      console.log(error);
      return res.status(500).send(sendBodyFormatter(error.message));
    }
  },

  async addServicosInOs(req: Request, res: Response) {
    try {
      await new OrdemServicoService().addServicosInOs(req.body);
      res.send();
    } catch (error: any) {
      res.status(500).send(sendBodyFormatter(error.message));
    }
  },
};
