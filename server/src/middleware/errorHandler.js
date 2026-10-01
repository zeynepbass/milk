import multer from "multer";
import mongoose from "mongoose";
import { AppError } from "../utils/AppError.js";

const MULTER_MESSAGES = {
  LIMIT_FILE_SIZE: "Dosya boyutu sınırı aşıldı",
  LIMIT_FILE_COUNT: "En fazla 5 dosya yüklenebilir",
  LIMIT_UNEXPECTED_FILE: "Beklenmeyen dosya alanı",
};

const toHttpError = (err) => {
  if (err instanceof AppError) {
    return err;
  }

  if (err instanceof multer.MulterError) {
    return new AppError(400, "UPLOAD_ERROR", MULTER_MESSAGES[err.code] ?? "Dosya yüklenemedi");
  }

  if (err instanceof mongoose.Error.CastError) {
    return new AppError(400, "INVALID_ID", "Geçersiz kimlik");
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return new AppError(400, "VALIDATION_ERROR", "Gönderilen veriler geçersiz");
  }

  if (err?.code === 11000) {
    return new AppError(409, "DUPLICATE", "Bu kayıt zaten mevcut");
  }

  if (err?.type === "entity.too.large") {
    return new AppError(413, "PAYLOAD_TOO_LARGE", "İstek gövdesi çok büyük");
  }

  if (err?.type === "entity.parse.failed") {
    return new AppError(400, "INVALID_JSON", "Geçersiz JSON");
  }

  return null;
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    message: "İstenen kaynak bulunamadı",
    code: "ROUTE_NOT_FOUND",
    requestId: req.id,
  });
};

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const httpError = toHttpError(err);

  if (!httpError) {
    req.log.error({ err }, "Beklenmeyen hata");

    return res.status(500).json({
      message: "Sunucu hatası",
      code: "INTERNAL_ERROR",
      requestId: req.id,
    });
  }

  if (httpError.status >= 500) {
    req.log.error({ err }, httpError.message);
  }

  return res.status(httpError.status).json({
    message: httpError.message,
    code: httpError.code,
    ...(httpError.details ? { details: httpError.details } : {}),
    requestId: req.id,
  });
};
