import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/login", AuthController.getUser);

export default authRouter;
