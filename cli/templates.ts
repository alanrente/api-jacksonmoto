interface CriaTemplate {
  templateService(): string;
  templateController(): string;
  templateRoute(): string;
  templateRoute(): string;
  templateRowRouteUse(): string;
  templateRowImport(): string;
  criaRecursoComInicialMaiuscula(): void;
}

class Templates implements CriaTemplate {
  private recurso: string;
  private Recurso: string = "";
  constructor(recurso: string) {
    this.recurso = recurso;
    this.criaRecursoComInicialMaiuscula();
  }

  templateRoute(): string {
    return `import { Router } from "express";
import { ${this.Recurso}Controller } from "../controllers/${this.recurso}.controller";
    
const ${this.recurso}Router = Router();
    
${this.recurso}Router.get("/", ${this.Recurso}Controller.getAll);
    
export default ${this.recurso}Router;`;
  }

  templateService(): string {
    return `import conexao from "../infra/database";
import { Sequelize } from "sequelize";
// import { ${this.Recurso}Model } from "../models/${this.recurso}.model";

export class ${this.Recurso}Service {
  private conection: Sequelize;
  // private ${this.recurso}Model: typeof ${this.Recurso}Model;

  constructor() {
    this.conection = conexao();
    // this.${this.recurso}Model = ${this.Recurso}Model;
  }

  async getAll() {
    // const ${this.recurso}s = await this.${this.recurso}Model.findAll();
    await this.conection.close();
    return ["${this.recurso}s"];
  }
}`;
  }

  templateController(): string {
    return `import { Request, Response } from "express";
import { ${this.Recurso}Service } from "../services/${this.recurso}.service";
import sendBodyFormatter from "../utils/sendBodyFormatter";

export const ${this.Recurso}Controller = {
  async getAll(req: Request, res: Response) {
    try {
      const result = await new ${this.Recurso}Service().getAll();
      return res.send(sendBodyFormatter(result, "body"));
    } catch (error: any) {
      console.log(error);
      return res.send(sendBodyFormatter(error.message));
    }
  },
};`;
  }

  templateRowImport(): string {
    return `import ${this.recurso}Router from "./${this.recurso}.router";\r\n`;
  }

  templateRowRouteUse(): string {
    return `routes.use("/${this.recurso}", ${this.recurso}Router);\r\n`;
  }

  criaRecursoComInicialMaiuscula() {
    this.Recurso = this.recurso[0].toUpperCase() + this.recurso.slice(1);
  }
}

export default Templates;
