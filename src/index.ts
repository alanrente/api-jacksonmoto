import { config } from "dotenv";
config();
import express from "express";
import cors from "cors";
import routes from "./routes";
import { sequelize } from "./infra/database";
const app = express();

app.use(cors());
app.use(express.json());

// (async () => {
//   await alphavantageService({ symbol: "mxrf11" });
//   process.exit(1);
// })();

try {
  sequelize.authenticate().then(async () => {
    // await sequelize.sync({ alter: true });

    console.debug("Conectado ao banco");
  });
} catch (error) {
  console.error("Não foi possível conectar ao banco", error);
}

app.get("/", (req, res) => {
  res.json({ message: "rota / metodo get" });
});

app.use("/api", routes);

const port = process.env.port;

app.listen(port, () => {
  console.debug(`http://localhost:${port}`);
});
