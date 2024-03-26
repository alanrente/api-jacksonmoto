import { config } from "dotenv";
config();
import express from "express";
import cors from "cors";
import routes from "./routes";
import { ServicoModel } from "./models/ServicoModel";
import { MecanicoModel } from "./models/MecanicoModel";
import { OrdemServicoModel } from "./models/OrdemServicoModel";
import { CategoriaModel } from "./models/CategoriaModel";
import { OS_ServicosModel } from "./models/OS_ServicosModel";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "api jacksonmoto" });
});

app.use("/api", routes);

const port = process.env.port;

app.listen(port, async () => {
  const models = {
    servicoModel: ServicoModel,
    mecanicoModel: MecanicoModel,
    ordemServicoModel: OrdemServicoModel,
    categoriaModel: CategoriaModel,
    osServicosModel: OS_ServicosModel,
  };

  Object.values(models).forEach((model) => {
    model.sync();
  });

  console.debug(`http://localhost:${port}`);
});
