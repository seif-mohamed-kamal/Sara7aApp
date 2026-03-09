import multer from "multer";
import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { fileFiter } from "./validatio.multer.js";

export const localFileUpload = ({
  folderName = "general",
  validation = [],
  maxSize = 1,
} = {}) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let filePath = resolve(`../uploads/${folderName}`);
      if (!existsSync(filePath)) {
        mkdirSync(filePath, { recursive: true });
      }
      cb(null, filePath);
    },

    filename: (req, file, cb) => {
      let uniqueName = randomUUID() + "_" + file.originalname;
      file.finalPath = `uploads/${folderName}/${uniqueName}`;
      cb(null, uniqueName);
    },
  });
  return multer({
    fileFilter: fileFiter(validation),
    storage,
    limits:{fileSize: maxSize * 1024 * 1024},
  });
};
