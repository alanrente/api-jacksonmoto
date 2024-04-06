import { Request, Response } from "express";
import { CategoriaService } from "../services/categoria.service";
import sendBodyFormatter from "../utils/sendBodyFormatter";

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
      const categoriaCreated = await new CategoriaService().create(categoria);
      return res.status(201).send(sendBodyFormatter(categoriaCreated, "body"));
    } catch (error: any) {
      console.log(error);
      return res.status(500).send(sendBodyFormatter(error.message));
    }
  },
  async update(req: Request, res: Response) {
    try {
      const { categoriaId } = req.params as { categoriaId: string };
      const { categoria } = req.body;
      const categoriaUpdated = await new CategoriaService().update(
        +categoriaId,
        categoria
      );
      res.send(sendBodyFormatter(categoriaUpdated, "body"));
    } catch (error) {
      res.status(500).send(sendBodyFormatter(error));
    }
  },
};
