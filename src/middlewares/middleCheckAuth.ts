import { NextFunction, Request, Response } from "express";
import sendBodyFormatter from "../utils/sendBodyFormatter";
import MyCipher from "../utils/crypto.util";

const middleCheckAuth = async (
  req: Request,
  resp: Response,
  next: NextFunction
) => {
  try {
    const bearer = req.headers.authorization;

    if (!bearer)
      return resp.status(400).send(sendBodyFormatter("token inválido!"));

    const encryptedToken = bearer.replace("Bearer ", "");
    const myCipher = new MyCipher();
    myCipher.myTokenAsUser(encryptedToken);

    next();
  } catch (error: any) {
    return resp.status(401).send(sendBodyFormatter(error.message));
  }
};

export default middleCheckAuth;
