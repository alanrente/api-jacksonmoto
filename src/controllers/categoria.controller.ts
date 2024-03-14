import { Request, Response } from "express";
import Conexao from "../infra/database";
import getCategoriaModel from "../models/CategoriaModel";

export const CategoriaController = {
  async get(req: Request, res: Response) {
    const conn = new Conexao();
    try {
      const categoriaModel = await getCategoriaModel(conn.sequelize);
      const result = await categoriaModel.findAll();
      return res.send(result);
    } catch (error: any) {
      return res.send({ message: error.message });
    } finally {
      try {
        await conn.close();
      } catch (err: any) {
        console.log("Não há conexao para fechar");
      }
    }
  },
  async post(req: Request, res: Response) {
    const conn = new Conexao();
    try {
      const { categoria } = req.body;
      const categoriaModel = await getCategoriaModel(conn.sequelize);
      const categoriaCreated = await categoriaModel.create({ categoria });
      return res.status(201).send(categoriaCreated);
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  },
};
