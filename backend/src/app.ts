import express from "express";
import cors from "cors";
import uploadRoutes from "./modules/upload/upload.routes";
import retrievalRoutes
from "./modules/retrieval/retrieval.routes";

const app = express();

app.use(cors());
app.use(express.json());

//routes
app.use("/upload", uploadRoutes);
app.use("/search", retrievalRoutes);


app.get("/health", (_, res) => {
  res.json({
    status: "OK",
  });
});

export default app;