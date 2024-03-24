import { Router } from "express";
import { HomeController } from "../controllers/home.controller";
import { ServicoService } from "../services/servico.service";

const homeRouter = Router();

homeRouter.get("/", HomeController.get);
homeRouter.get("/servicos", async (req, res) => {
  const servicos = await new ServicoService().getAll();
  res.send(servicos);
});
// homeRouter.get("/mecanicos", async (req, res) => {
//   const mecanicos = await new Mecani().getAll();
//   res.send(mecanicos);
// });

export default homeRouter;
