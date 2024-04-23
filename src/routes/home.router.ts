import { Router } from "express";
import { HomeController } from "../controllers/home.controller";
import { ServicoService } from "../services/servico.service";
import { OrdemServicoService } from "../services/ordemServicoService.service";

const homeRouter = Router();

homeRouter.get("/", HomeController.get);

// homeRouter.get("/mecanicos", async (req, res) => {
//   const mecanicos = await new Mecani().getAll();
//   res.send(mecanicos);
// });

export default homeRouter;
