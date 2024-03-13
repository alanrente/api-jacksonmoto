import { Router } from "express";
import homeRouter from "./home.router";
import categoriaRouter from "./categoria.router";

const routes = Router();

routes.use("/home", homeRouter);
routes.use("/categorias", categoriaRouter);

export default routes;
