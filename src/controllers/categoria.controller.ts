import { Request, Response } from "express";
import Conexao from "../infra/database";
import getCategoriaModel from "../models/CategoriaModel";

export const CategoriaController = {
  async get(req: Request, res: Response) {
    const conn = new Conexao();
    const categoriaModel = await getCategoriaModel(conn.sequelize);

    try {
      const result = await categoriaModel.findAll();

      const mapResult = result.map((item) => item);

      return res.send(mapResult);
    } catch (error: any) {
      res.send({ message: error.message });
    } finally {
      try {
        await conn.close();
      } catch (err: any) {
        console.log("Não há conexao para fechar");
      }
    }
  },
  async post(req: Request, res: Response) {},
};
