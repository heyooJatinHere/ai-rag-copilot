import { Request, Response } from "express";
import { uploadDocument } from "./upload.service";

export const uploadPdf = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "File missing",
      });
    }

    const result = await uploadDocument(req.file);

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Upload failed",
    });
  }
};