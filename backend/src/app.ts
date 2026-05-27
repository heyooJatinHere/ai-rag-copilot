import express from "express";
import cors from "cors";
import uploadRoutes from "./modules/upload/upload.routes";

const app = express();

app.use(cors());
app.use(express.json());

//routers
app.use("/upload", uploadRoutes);

app.get("/health", (_, res) => {
  res.json({
    status: "OK",
  });
});

export default app;