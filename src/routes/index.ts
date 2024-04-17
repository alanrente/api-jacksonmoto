import { Router } from "express";
import homeRouter from "./home.router";
import categoriaRouter from "./categoria.router";
import ordemServicoRouter from "./ordemServico.router";
import servicoRouter from "./servico.router";
import middleCheckAuth from "../middlewares/middleCheckAuth";
import authRouter from "./auth.router";
import mapperRoutes from "../utils/mapperRoutes.util";
import clienteRouter from "./cliente.router";
import mecanicoRouter from "./mecanico.router";

const routes = Router();

routes.get("/", (req, res) => {
  res.json({ message: "api jacksonmoto" });
});

routes.use("/auth", authRouter);
routes.use("/home", middleCheckAuth, homeRouter);
routes.use("/categorias", categoriaRouter);
routes.use("/ordem-servicos", middleCheckAuth, ordemServicoRouter);
routes.use("/servicos", middleCheckAuth, servicoRouter);
routes.use("/cliente", middleCheckAuth, clienteRouter);
routes.use("/mecanico", middleCheckAuth, mecanicoRouter);

mapperRoutes(routes);

export default routes;
