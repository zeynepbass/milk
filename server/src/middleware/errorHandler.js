import multer from "multer";

export const notFoundHandler = (req, res) => {
  res.status(404).json({ message: "İstenen kaynak bulunamadı" });
};

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }

  const status = err.status || 500;

  res.status(status).json({
    message: status === 500 ? "Sunucu hatası" : err.message,
  });
};
