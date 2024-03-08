import { Router } from "express";
import { Conexao } from "../infra/database";
import sequelize from "sequelize";

const routes = Router();
// apenas um teste de conexão
routes.get("/home", async (req, res) => {
  const conn = new Conexao();
  try {
    const result = await conn.sequelize.query('select * from "ATIVOS_TB";', {
      type: sequelize.QueryTypes.SELECT,
    });

    await conn.close();
    return res.send(result);
  } catch (error: any) {
    res.send({ message: error.message });
  } finally {
    try {
      await conn.sequelize.authenticate();
      await conn.close();
    } catch (err: any) {
      console.log("Conexao já foi fechada");
    }
  }
});

export default routes;
