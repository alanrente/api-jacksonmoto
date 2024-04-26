import { NextFunction, Request, Response } from "express";
import database from "../infra/database";
import sendBodyFormatter from "../utils/sendBodyFormatter";
import Sequelize from "sequelize";
import { User } from "../interfaces/Auth.interface";
import MyCipher from "../utils/crypto.util";

const middleCheckAuth = async (
  req: Request,
  resp: Response,
  next: NextFunction
) => {
  const con = database();
  const bearer = req.headers.authorization;

  if (!bearer)
    return resp.status(400).send(sendBodyFormatter("token inválido!"));

  const encryptedToken = bearer.replace("Bearer ", "");

  const { chave, user } = new MyCipher().myTokenAsUser(encryptedToken);

  const [result] = await con.query<User>(
    "select * from usuario_tb where chave = $chave limit 1",
    {
      bind: { chave: chave },
      type: Sequelize.QueryTypes.SELECT,
    }
  );

  await con.close();

  if (!result || chave !== result.chave) {
    return resp.status(401).send(sendBodyFormatter("não autorizado"));
  }

  next();
};

export default middleCheckAuth;
