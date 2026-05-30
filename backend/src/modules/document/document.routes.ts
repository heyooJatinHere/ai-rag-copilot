import { Router } from "express";
import { listDocuments } from "./document.controller";

const router = Router();

router.get("/", listDocuments);

export default router;