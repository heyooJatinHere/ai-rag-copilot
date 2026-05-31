import express from "express";
import cors from "cors";
import uploadRoutes from "./modules/upload/upload.routes";
import retrievalRoutes
  from "./modules/retrieval/retrieval.routes";
import chatRoutes
  from "./modules/chat/chat.routes";

import documentRoutes
  from "./modules/document/document.routes";

import conversationRoutes
  from "./modules/conversation/conversation.routes";

import path from "path";

const app = express();

app.use(cors());
app.use(express.json());

//routes
app.use("/upload", uploadRoutes);
app.use("/search", retrievalRoutes);
app.use("/chat", chatRoutes);
app.use("/documents", documentRoutes);
app.use(
  "/uploads",
  express.static(
    path.resolve(
      process.cwd(),
      "../uploads"
    )
  )
);

app.use(
  "/conversations",
  conversationRoutes
);


app.get("/health", (_, res) => {
  res.json({
    status: "OK",
  });
});

export default app;