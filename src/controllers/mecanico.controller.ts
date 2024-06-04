import { Request, Response } from "express";
import { MecanicoService } from "../services/mecanico.service";
import sendBodyFormatter from "../utils/sendBodyFormatter";
import MyCipher from "../services/crypto.service";
import { HttpStatusCode } from "axios";
import {
  ZParamMecanico,
  ZMecanicoType,
  ZParamMecType,
  ZMecanico,
} from "../interfaces/Mecanico.interface";
import { z } from "zod";

class MecanicoController {
  private mecanicoService: MecanicoService;
  constructor() {
    this.mecanicoService = new MecanicoService();
  }

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = new MyCipher().myTokenAsUser(`${req.headers.authorization}`);
      const result = await this.mecanicoService.getAll(user.user);
      res.send(sendBodyFormatter(result, "body"));
    } catch (error: any) {
      console.log(error);
      res
        .status(HttpStatusCode.InternalServerError)
        .send(sendBodyFormatter(error.message));
    }
  };

  getOne = async (req: Request, res: Response): Promise<void> => {
    try {
      const { idMecanico } = req.params;
      const user = new MyCipher().myTokenAsUser(
        `${req.headers.authorization}`
      ).user;

      const result = await ZParamMecanico.safeParseAsync({
        idMecanico: Number(idMecanico),
      });

      if (!result.success) {
        res
          .status(HttpStatusCode.BadRequest)
          .send(sendBodyFormatter(result.error.issues[0].message));
        return;
      }

      const mecanico = await this.mecanicoService.findOne({
        idMecanico: Number(idMecanico),
        usuario: user,
      });

      if (!mecanico) {
        res
          .status(HttpStatusCode.NotFound)
          .send(sendBodyFormatter(`idMecanico ${idMecanico} não encontrado!`));
        return;
      }

      res.send(mecanico);
    } catch (err: any) {
      res
        .status(HttpStatusCode.InternalServerError)
        .send(sendBodyFormatter(err.message));
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const user = new MyCipher().myTokenAsUser(
      `${req.headers.authorization}`
    ).user;

    const { nome } = req.body as ZMecanicoType;

    const resultBody = await z.string().safeParseAsync(nome);

    if (!resultBody.success) {
      res
        .status(HttpStatusCode.BadRequest)
        .send(sendBodyFormatter(resultBody.error.issues[0].message));
      return;
    }

    try {
      const mecanico = await this.mecanicoService.create({
        mecanico: { nome },
        usuario: user,
      });

      res.send(sendBodyFormatter(mecanico, "body"));
    } catch (error: any) {
      res
        .status(HttpStatusCode.InternalServerError)
        .send(sendBodyFormatter(error.message));
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const { nome, status } = req.body as ZMecanicoType;
    const { idMecanico } = req.params as any as ZParamMecType;
    const user = new MyCipher().myTokenAsUser(
      `${req.headers.authorization}`
    ).user;

    const result = ZMecanico.safeParse({ nome });

    const resIdMecanico = ZParamMecanico.safeParse({
      idMecanico: Number(idMecanico),
    });

    const resultStatus = z
      .number({ message: "status required" })
      .min(0)
      .max(1)
      .safeParse(status);

    if (!result.success || !resultStatus.success || !resIdMecanico.success) {
      const message =
        (result.error && result.error.issues[0]) ||
        (resIdMecanico.error && resIdMecanico.error.issues[0]) ||
        (resultStatus.error && resultStatus.error.issues[0]);

      res
        .status(HttpStatusCode.BadRequest)
        .send(sendBodyFormatter(`[${message?.path}]: ${message?.message}`));
      return;
    }

    const [mecanicoUpdated] = await this.mecanicoService.update({
      mecanico: { nome, status },
      idMecanico: Number(idMecanico),
      usuario: user,
    });

    if (mecanicoUpdated == 0) {
      res
        .status(HttpStatusCode.NotFound)
        .send(sendBodyFormatter(`idMecanico ${idMecanico} não encontrado!`));
      return;
    }

    res.send(sendBodyFormatter(`idMecanico ${idMecanico} atualizado!`));
  };
}

export default new MecanicoController();
