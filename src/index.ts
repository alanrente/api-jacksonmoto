import { config } from "dotenv";
config();
import express from "express";
import cors from "cors";
import routes from "./routes";
import database from "./infra/database";
import { ServicoModel } from "./models/ServicoModel";
import { getMecanicoModel } from "./models/MecanicoModel";
import { getOrdemServicoModel } from "./models/OrdemServicoModel";
import { getCategoriaModel } from "./models/CategoriaModel";
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
    mecanicoModel: getMecanicoModel(conexao),
    ordemServicoModel: getOrdemServicoModel(conexao),
    categoriaModel: getCategoriaModel(conexao),
  };

  Object.values(models).forEach((model) => {
    model.sync();
  });

  console.debug(`http://localhost:${port}`);
});
