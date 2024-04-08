import conexao from "../infra/database";
import { Conection } from "../interfaces/Conection.interface";

import Sequelize from "sequelize";
import { User } from "../interfaces/Auth.interface";

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
      const [result] = await this.conection.query(
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
      return { usuario: user.usuario, chave: user.chave };
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
new AuthService().getOneUser;
