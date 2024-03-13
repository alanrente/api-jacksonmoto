import { Router } from "express";
import { CategoriaController } from "../controllers/categoria.controller";

const categoriaRouter = Router();

categoriaRouter.get("/", CategoriaController.get);

export default categoriaRouter;
