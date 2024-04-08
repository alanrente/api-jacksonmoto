import { Router } from "express";
import { ClienteController } from "../controllers/cliente.controller";
    
const clienteRouter = Router();
    
clienteRouter.get("/", ClienteController.getAll);
    
export default clienteRouter;