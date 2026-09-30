import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import multer from "multer";
import { fileTypeFromBuffer } from "file-type";
import { env } from "../config/env.js";
import { badRequest } from "../utils/AppError.js";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

const unsupportedImage = () =>
  badRequest("Sadece JPEG, PNG veya WEBP görseller yüklenebilir", "UNSUPPORTED_FILE_TYPE");

const multerInstance = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 5 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(unsupportedImage());
    }
  },
});

const detectImageExtension = async (buffer) => {
  const detected = await fileTypeFromBuffer(buffer);
  return detected ? ALLOWED_IMAGE_TYPES.get(detected.mime) : undefined;
};

const persistImages = async (req, res, next) => {
  const files = req.files ?? (req.file ? [req.file] : []);

  const extensions = await Promise.all(files.map((file) => detectImageExtension(file.buffer)));

  if (extensions.some((extension) => !extension)) {
    return next(unsupportedImage());
  }

  await Promise.all(
    files.map(async (file, index) => {
      const filename = `${randomUUID()}.${extensions[index]}`;
      await fs.writeFile(path.join(env.uploadDir, filename), file.buffer);
      file.filename = filename;
      file.buffer = undefined;
    })
  );

  return next();
};

export const uploadImages = (field, maxCount) => [multerInstance.array(field, maxCount), persistImages];

export const uploadImage = (field) => [multerInstance.single(field), persistImages];
