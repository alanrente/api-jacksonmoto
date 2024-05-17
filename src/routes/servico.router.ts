import { Router } from "express";
import { ServicoController } from "../controllers/servico.controller";

const servicoRouter = Router();
const servicoController = new ServicoController();

servicoRouter.get("/", servicoController.getAll);
servicoRouter.put("/:idServico", servicoController.update);

export default servicoRouter;
