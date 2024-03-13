import { Router } from "express";
import { HomeController } from "../controllers/home.controller";

const homeRouter = Router();

homeRouter.get("/", HomeController.get);

export default homeRouter;
