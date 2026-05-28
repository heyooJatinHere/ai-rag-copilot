import fs from "fs";
import pdfParse from "pdf-parse-new";

export const extractPdfText = async (
  filePath: string
) => {

  const dataBuffer =
    fs.readFileSync(filePath);

  const pdfData =
    await pdfParse(dataBuffer);

  return {
    text: pdfData.text,
    pages: pdfData.numpages,
  };
};