import { randomUUID } from "node:crypto";
import multer from "multer";
import { fileTypeFromBuffer } from "file-type";
import { storage } from "../storage/index.js";
import { badRequest } from "../utils/AppError.js";
import { RULES } from "../validators/rules.js";

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
  limits: { fileSize: MAX_FILE_SIZE, files: RULES.postImages.max },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(unsupportedImage());
    }
  },
});

const detectImageType = async (buffer) => {
  const detected = await fileTypeFromBuffer(buffer);
  return detected && ALLOWED_IMAGE_TYPES.has(detected.mime) ? detected.mime : undefined;
};

const persistImages = async (req, res, next) => {
  const files = req.files ?? (req.file ? [req.file] : []);
  const mimeTypes = await Promise.all(files.map((file) => detectImageType(file.buffer)));

  if (mimeTypes.some((mime) => !mime)) {
    return next(unsupportedImage());
  }

  await Promise.all(
    files.map(async (file, index) => {
      const mime = mimeTypes[index];
      const key = `${randomUUID()}.${ALLOWED_IMAGE_TYPES.get(mime)}`;
      file.url = await storage.save({ key, buffer: file.buffer, contentType: mime });
      file.buffer = undefined;
    })
  );

  return next();
};

export const uploadImages = (field, maxCount) => [multerInstance.array(field, maxCount), persistImages];

export const uploadImage = (field) => [multerInstance.single(field), persistImages];

export const uploadedUrls = (req) => (req.files ?? (req.file ? [req.file] : [])).map((file) => file.url);

const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;

const unsupportedDocument = () => badRequest("Sadece PDF belgeler yüklenebilir", "UNSUPPORTED_FILE_TYPE");

const documentUploader = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_DOCUMENT_SIZE, files: 1 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(unsupportedDocument());
    }
  },
});

const verifyPdf = async (req, res, next) => {
  if (!req.file) return next(badRequest("Belge seçilmedi", "FILE_REQUIRED"));

  const detected = await fileTypeFromBuffer(req.file.buffer);
  return detected?.mime === "application/pdf" ? next() : next(unsupportedDocument());
};

export const uploadDocument = (field) => [documentUploader.single(field), verifyPdf];
