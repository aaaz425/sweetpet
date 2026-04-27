import { mkdirSync } from "node:fs";
import { extname, resolve } from "node:path";
import crypto from "node:crypto";
import multer from "multer";

export const uploadRoot = resolve(process.env.UPLOAD_PATH ?? "./uploads");
mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadRoot),
  filename: (_req, file, callback) => {
    const ext = extname(file.originalname).toLowerCase() || ".jpg";
    const name = `${Date.now()}-${crypto.randomUUID()}${ext}`;
    callback(null, name);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      callback(new Error("only image files are allowed"));
      return;
    }
    callback(null, true);
  }
});

export function uploadedPath(file?: Express.Multer.File) {
  return file ? `/uploads/${file.filename}` : null;
}
