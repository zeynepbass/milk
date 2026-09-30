export class AppError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const badRequest = (message, code = "BAD_REQUEST", details) =>
  new AppError(400, code, message, details);

export const unauthorized = (message = "Oturum geçersiz", code = "UNAUTHORIZED") =>
  new AppError(401, code, message);

export const forbidden = (message = "Bu işlem için yetkiniz yok", code = "FORBIDDEN") =>
  new AppError(403, code, message);

export const notFound = (message = "Kayıt bulunamadı", code = "NOT_FOUND") =>
  new AppError(404, code, message);

export const conflict = (message, code = "CONFLICT") => new AppError(409, code, message);

export const tooManyRequests = (message, code = "TOO_MANY_REQUESTS") =>
  new AppError(429, code, message);
