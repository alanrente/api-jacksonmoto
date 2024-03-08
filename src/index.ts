import { config } from "dotenv";
config();
import express from "express";
import cors from "cors";
import routes from "./routes";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "api jacksonmoto" });
});

app.use("/api", routes);

const port = process.env.port;

app.listen(port, () => {
  console.debug(`http://localhost:${port}`);
});
