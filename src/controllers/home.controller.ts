import { Request, Response } from "express";

export const HomeController = {
  get(req: Request, res: Response) {
    res.json({ api: "api version 0.0.1" });
  },
};
