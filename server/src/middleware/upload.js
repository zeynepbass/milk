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
