import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

app.use(cors({ origin: "https://appjacksonmoto.vercel.app/" }));
app.use(express.json());

app.use("/api", routes);

const port = process.env.PORT;

app.listen(port, async () => {
  console.log(`http://localhost:${port}`);
});
