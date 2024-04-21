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

export default ordemServicoRouter;
