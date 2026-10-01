import { pipeline } from "node:stream/promises";
import * as organicService from "../services/organic.service.js";

export const submitApplication = async (req, res) => {
  const application = await organicService.submitApplication(req.userId, req.file);
  res.status(201).json({ message: "Başvurun alındı, inceleme sonrası bilgilendirileceksin", application });
};

export const getMyApplication = async (req, res) => {
  res.json({ application: await organicService.getLatestApplication(req.userId) });
};

export const listApplications = async (req, res) => {
  res.json(await organicService.listApplications(req.query));
};

export const reviewApplication = async (req, res) => {
  const application = await organicService.reviewApplication(req.userId, req.params.id, req.body);
  res.json({ message: "Başvuru güncellendi", application });
};

export const downloadDocument = async (req, res) => {
  const { stream, application } = await organicService.openDocument(req.user, req.params.id);
  const filename = encodeURIComponent(application.originalName || "organik-sertifika.pdf");

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `inline; filename*=UTF-8''${filename}`,
    "Cache-Control": "private, no-store",
  });
  await pipeline(stream, res);
};
