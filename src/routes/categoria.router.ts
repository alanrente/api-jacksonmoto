import { Router } from "express";
import { CategoriaController } from "../controllers/categoria.controller";

const categoriaRouter = Router();

categoriaRouter.get("/", CategoriaController.getAll);
categoriaRouter.get("/:categoriaId", CategoriaController.getOne);
categoriaRouter.post("/", CategoriaController.create);
categoriaRouter.put("/:categoriaId", CategoriaController.update);

export default categoriaRouter;
