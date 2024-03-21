import { Request, Response } from "express";
import conexao from "../infra/database";
import getCategoriaModel from "../models/CategoriaModel";
import { CategoriaService } from "../services/categoria.service";

const sendBodyFormatter = (body: any, type: "msg" | "body" = "msg") => {
  const sends = {
    msg: { message: body },
    body: body,
  };

  return sends[type];
};

export const CategoriaController = {
  async getAll(req: Request, res: Response) {
    try {
      const result = await new CategoriaService().getAll();
      return res.send(sendBodyFormatter(result, "body"));
    } catch (error: any) {
      console.log(error);
      return res.send(sendBodyFormatter(error.message));
    }
  },
  async getOne(req: Request, res: Response) {
    try {
      const { categoriaId } = req.params as { categoriaId: string };

      const result = await new CategoriaService().getOne(+categoriaId);
      if (!result)
        return res
          .status(404)
          .send(sendBodyFormatter("nenhuma categoria encontrada!"));
      return res.send(sendBodyFormatter(result, "body"));
    } catch (error: any) {
      console.log(error);
      return res.send(sendBodyFormatter(error.message));
    }
  },
  async create(req: Request, res: Response) {
    try {
      const { categoria } = req.body;
      const conn = await conexao();
      const categoriaModel = await getCategoriaModel(conn);
      const categoriaCreated = await categoriaModel.create({ categoria });
      conn.close();
      return res.status(201).send(sendBodyFormatter(categoriaCreated));
    } catch (error: any) {
      console.log(error);
      return res.status(500).send(sendBodyFormatter(error.message));
    }
  },
  async update(req: Request, res: Response) {
    const { categoriaId } = req.params as { categoriaId: string };
    console.log(categoriaId);
    res.send(sendBodyFormatter("rota put chamada"));
  },
};
