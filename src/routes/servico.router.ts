import { Router } from "express";
import { ServicoController } from "../controllers/servico.controller";

const servicoRouter = Router();

servicoRouter.get("/", ServicoController.getAll);

export default servicoRouter;
