import { Router } from "express";
import { OrdemServicoController } from "../controllers/ordemServico.controller";

const ordemServicoRouter = Router();

ordemServicoRouter.get("/", OrdemServicoController.getAll);
ordemServicoRouter.post(
  "/",
  OrdemServicoController.createOSWithServicosMecanicoAndCliente
);

export default ordemServicoRouter;
