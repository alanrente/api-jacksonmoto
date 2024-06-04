import { Router } from "express";
import MecanicoController from "../controllers/mecanico.controller";

const mecanicoRouter = Router();

mecanicoRouter.get("/", MecanicoController.getAll);
mecanicoRouter.get("/:idMecanico", MecanicoController.getOne);
mecanicoRouter.put("/:idMecanico", MecanicoController.update);
mecanicoRouter.post("/", MecanicoController.create);

export default mecanicoRouter;
