import { Router } from "express";
import multer from "multer";
import { uploadPdf } from "./upload.controller";

const router = Router();

const upload = multer({
  dest: "uploads/",
});

router.post("/", upload.single("file"), uploadPdf);

export default router;