import { Router } from "express";
import { MecanicoController } from "../controllers/mecanico.controller";
    
const mecanicoRouter = Router();
    
mecanicoRouter.get("/", MecanicoController.getAll);
    
export default mecanicoRouter;