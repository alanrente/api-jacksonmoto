import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

const enableds = ["https://appjacksonmoto.vercel.app"];

app.use(
  cors({
    origin: (origin, call) => {
      console.log("origin", origin);

      if (!origin && process.env.NODE_ENV != "development")
        return call(new Error("Não existe origem"));
      if (
        enableds.indexOf(origin!) !== -1 ||
        process.env.NODE_ENV == "development"
      ) {
        call(null, true);
      } else {
        call(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(express.json());

app.use("/api", routes);

const port = process.env.PORT;

app.listen(port, async () => {
  console.log(`http://localhost:${port}`);
});
