import { Request, Response } from "express";
import conexao from "../infra/database";
import getCategoriaModel from "../models/CategoriaModel";

export const CategoriaController = {
  async get(req: Request, res: Response) {
    try {
      const conn = await conexao();
      const categoriaModel = await getCategoriaModel(conn);
      const result = await categoriaModel.findAll();
      conn.close();
      return res.send(result);
    } catch (error: any) {
      console.log(error);
      return res.send({ message: error.message });
    }
  },
  async post(req: Request, res: Response) {
    try {
      const { categoria } = req.body;
      const conn = await conexao();
      const categoriaModel = await getCategoriaModel(conn);
      const categoriaCreated = await categoriaModel.create({ categoria });
      conn.close();
      return res.status(201).send(categoriaCreated);
    } catch (error: any) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  },
};
