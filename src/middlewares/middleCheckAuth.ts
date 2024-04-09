import { NextFunction, Request, Response } from "express";
import database from "../infra/database";
import sendBodyFormatter from "../utils/sendBodyFormatter";
import Sequelize from "sequelize";

const middleCheckAuth = async (
  req: Request,
  resp: Response,
  next: NextFunction
) => {
  const con = database();
  const bearer = req.headers.authorization;

  if (!bearer)
    return resp.status(400).send(sendBodyFormatter("token inválido!"));

  const chave = bearer.replace("Bearer ", "");

  const [result, metadata] = await con.query(
    "select * from jackson_moto_db.usuario_tb where chave = $chave limit 1",
    {
      bind: { chave: chave },
      type: Sequelize.QueryTypes.SELECT,
      raw: true,
    }
  );
  await con.close();
  if (!result) {
    return resp.status(401).send(sendBodyFormatter("não autorizado"));
  }
  next();
};

export default middleCheckAuth;
