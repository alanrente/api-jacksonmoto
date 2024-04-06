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
    const template = this.template.templateController();
    fs.writeFileSync(
      path.join(this.pathSrc, `/controllers/${this.recurso}.controller.ts`),
      template
    );
  }
  private createService() {
    const template = this.template.templateService();
    fs.writeFileSync(
      path.join(this.pathSrc, `/services/${this.recurso}.service.ts`),
      template
    );
  }

  private createRoute() {
    const template = this.template.templateRoute();
    fs.writeFileSync(
      path.join(this.pathSrc, `/routes/${this.recurso}.router.ts`),
      template
    );
  }

  private addRowIndexRoute({
    fileAsString,
    refRow,
    template,
  }: {
    refRow: string;
    template: string;
    fileAsString: string;
  }): string {
    let strFileToSave: string = "";
    let lastIndexRowRoute = 0;
    fileAsString.split("\r\n").forEach((rowFile, index) => {
      if (rowFile.includes(refRow)) {
        lastIndexRowRoute = index;
      }

      const toAddTemplate =
        lastIndexRowRoute > 0 &&
        index > lastIndexRowRoute &&
        lastIndexRowRoute === index - 1;

      if (toAddTemplate) {
        strFileToSave = strFileToSave + template;
      }

      strFileToSave =
        strFileToSave +
        rowFile +
        (index === fileAsString.split("\r\n").length - 1 ? "" : "\r\n");
    });

    return strFileToSave;
  }

  private addRowsInRoute() {
    const pathFileIndexRoute = path.join(this.pathSrc, "routes/index.ts");
    const fileIndexRouter = fs.readFileSync(pathFileIndexRoute).toString();

    let templateRouteUse = "";
    let strFileToSave = "";

    templateRouteUse = this.template.templateRowImport();
    strFileToSave = this.addRowIndexRoute({
      refRow: "import ",
      template: templateRouteUse,
      fileAsString: fileIndexRouter,
    });

    templateRouteUse = this.template.templateRowRouteUse();
    strFileToSave = this.addRowIndexRoute({
      refRow: "routes.use",
      template: templateRouteUse,
      fileAsString: strFileToSave,
    });

    fs.writeFileSync(pathFileIndexRoute, strFileToSave);
  }

  createFiles() {
    this.createService();
    this.createController();
    this.createRoute();
    this.addRowsInRoute();
  }
}
