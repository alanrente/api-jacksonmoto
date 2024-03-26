import { config } from "dotenv";
config();
import express from "express";
import cors from "cors";
import routes from "./routes";
import database from "./infra/database";
import { ServicoModel } from "./models/ServicoModel";
import { MecanicoModel } from "./models/MecanicoModel";
import { OrdemServicoModel } from "./models/OrdemServicoModel";
import { CategoriaModel } from "./models/CategoriaModel";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "api jacksonmoto" });
});

app.use("/api", routes);

const port = process.env.port;

app.listen(port, async () => {
  const conexao = database();
  const models = {
    servicoModel: ServicoModel,
    mecanicoModel: MecanicoModel,
    ordemServicoModel: OrdemServicoModel,
    categoriaModel: CategoriaModel,
  };

  Object.values(models).forEach((model) => {
    model.sync();
  });

  console.debug(`http://localhost:${port}`);
});
