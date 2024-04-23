import { enc, AES } from "crypto-js";

import conexao from "../infra/database";
import { Conection } from "../interfaces/Conection.interface";

import Sequelize from "sequelize";
import { User } from "../interfaces/Auth.interface";
import MyCipher from "../utils/crypto.util";

export class AuthService extends Conection {
  constructor() {
    super(conexao());
  }

  async getOneUser({
    senha: pass,
    usuario: username,
  }: {
    usuario: string;
    senha: string;
  }) {
    try {
      const [result] = await this.conection.query<User>(
        "select * from jackson_moto_db.usuario_tb where usuario = $username and senha = $pass limit 1",
        {
          bind: { username, pass },
          type: Sequelize.QueryTypes.SELECT,
          raw: true,
        }
      );

      const user = result as User;
      if (!user) {
        throw "Nenhum usuario encontrado!";
      }

      if (!user.chave) {
        throw "Usuário sem chave cadastrada!";
      }

      await this.closeConection();

      const myCipher = new MyCipher();
      const encrypt = myCipher.encrypt({
        user: user.usuario,
        chave: user.chave,
      });

      return { usuario: user.usuario, chave: encrypt };
    } catch (error: any) {
      throw new Error(error);
    }
  }

  tokenUser(authorization: string) {
    const token = authorization.replace("Bearer ", "");
  }
}
