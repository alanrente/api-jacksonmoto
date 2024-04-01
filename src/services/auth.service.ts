import moment from "moment";
import conexao from "../infra/database";
import { Conection } from "../interfaces/Conection.interface";

import Sequelize from "sequelize";
import { User } from "../interfaces/Auth.interface";

export class AuthService extends Conection {
  constructor() {
    super(conexao());
  }

  async getOneUser({
    senha,
    usuario,
  }: {
    usuario: string;
    senha: string;
  }): Promise<string> {
    try {
      const [result, metadata] = await this.conection.query(
        "select * from jackson_moto_db.usuario_tb where usuario = $usuario and senha = $senha limit 1",
        {
          bind: { usuario, senha },
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

      return user.chave;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
