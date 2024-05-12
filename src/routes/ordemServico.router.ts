import { Router } from "express";
import { OrdemServicoController } from "../controllers/ordemServico.controller";

const ordemServicoRouter = Router();

ordemServicoRouter.get("/", OrdemServicoController.getAll);
ordemServicoRouter.post(
  "/",
  OrdemServicoController.createOSWithServicosMecanicoAndCliente
);
ordemServicoRouter.post(
  "/adicionar-servicos-os",
  OrdemServicoController.addServicosInOs
);
ordemServicoRouter.patch("/:id/", OrdemServicoController.closeOrReopen);

export default ordemServicoRouter;
