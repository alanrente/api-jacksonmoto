import { Router } from "express";
import { OrdemServicoController } from "../controllers/ordemServico.controller";

const ordemServicoRouter = Router();

ordemServicoRouter.get("/", OrdemServicoController.getAll);
ordemServicoRouter.get("/abertos", OrdemServicoController.getAllAbertos);
ordemServicoRouter.post(
  "/",
  OrdemServicoController.createOSWithServicosMecanicoAndCliente
);
ordemServicoRouter.post(
  "/adicionar-servicos-os",
  OrdemServicoController.addServicosInOs
);
ordemServicoRouter.delete(
  "/deletar-servico-os",
  OrdemServicoController.removeServicoOS
);
ordemServicoRouter.patch("/:id/", OrdemServicoController.closeOrReopen);

export default ordemServicoRouter;
