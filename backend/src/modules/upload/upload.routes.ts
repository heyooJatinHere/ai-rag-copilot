import { Router } from "express";
import multer from "multer";
import { uploadPdf } from "./upload.controller";
import path from 'path'

const router = Router();

const upload = multer({
  dest: path.resolve(
    process.cwd(),
    "../uploads"
  ),
});

router.post("/", upload.single("file"), uploadPdf);

export default router;