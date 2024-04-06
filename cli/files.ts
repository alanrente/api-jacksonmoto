import * as fs from "fs";
import Templates from "./templates";
import path from "path";

export default class Files {
  private recurso: string;
  private template: Templates;
  private pathSrc = path.resolve(path.join("src"));
  constructor(recurso: string) {
    this.recurso = recurso;
    this.template = new Templates(recurso);
    console.log("path:", this.pathSrc);
  }

  get getRecurso() {
    return this.recurso;
  }

  private createController() {
    const template = this.template.criaControllerTemplate();
    fs.writeFileSync(
      path.join(this.pathSrc, `/controllers/${this.recurso}.controller.ts`),
      template
    );
  }
  private createService() {
    const template = this.template.criaServiceTemplate();
    fs.writeFileSync(
      path.join(this.pathSrc, `/services/${this.recurso}.service.ts`),
      template
    );
  }
  private createRoute() {
    const template = this.template.criaRouteTemplate();
    fs.writeFileSync(
      path.join(this.pathSrc, `/routes/${this.recurso}.router.ts`),
      template
    );
  }

  createFiles() {
    this.createService();
    this.createController();
    this.createRoute();
  }
}
