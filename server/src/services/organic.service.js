import { randomUUID } from "node:crypto";
import mongoose from "mongoose";
import OrganicApplication from "../models/OrganicApplication.js";
import User from "../models/User.js";
import { conflict, forbidden, notFound } from "../utils/AppError.js";
import { paginate } from "../utils/pagination.js";
import { withTransaction } from "../utils/transaction.js";
import { storage } from "../storage/index.js";
import { logger } from "../utils/logger.js";
import { recordNotification } from "./notification.service.js";

const APPLICANT_FIELDS = "name surname email province district role organicStatus dogrulanmisSatici";

const applicationNotFound = () => notFound("Başvuru bulunamadı", "APPLICATION_NOT_FOUND");

const toApplicationView = (application) => ({
  _id: application._id,
  user: application.user,
  originalName: application.originalName,
  status: application.status,
  note: application.note,
  createdAt: application.createdAt,
  reviewedAt: application.reviewedAt,
});

const assertCanApply = async (userId) => {
  const user = await User.findOne({ _id: userId, deletedAt: null }).select("role organicStatus").lean();

  if (!user) throw notFound("Kullanıcı bulunamadı", "USER_NOT_FOUND");
  if (user.role === "alici") throw forbidden("Yalnızca satıcılar başvuru yapabilir", "ROLE_NOT_ALLOWED");
  if (user.organicStatus) throw conflict("Hesabın zaten doğrulanmış", "ALREADY_VERIFIED");
};

const pendingConflict = () => conflict("İncelemede bekleyen bir başvurun var", "APPLICATION_PENDING");

const discardDocument = (key) =>
  storage.removePrivate(key).catch((err) => logger.warn({ err, key }, "Başvuru belgesi silinemedi"));

export const submitApplication = async (userId, file) => {
  await assertCanApply(userId);

  if (await OrganicApplication.exists({ user: userId, status: "pending" })) {
    throw pendingConflict();
  }

  const documentKey = await storage.savePrivate({
    key: `${randomUUID()}.pdf`,
    buffer: file.buffer,
    contentType: "application/pdf",
  });

  try {
    const application = await OrganicApplication.create({
      user: userId,
      documentKey,
      originalName: file.originalname?.slice(0, 200),
    });
    return toApplicationView(application.toObject());
  } catch (err) {
    await discardDocument(documentKey);
    if (err?.code === 11000) throw pendingConflict();
    throw err;
  }
};

export const getLatestApplication = async (userId) => {
  const application = await OrganicApplication.findOne({ user: userId }).sort({ createdAt: -1 }).lean();
  return application ? toApplicationView(application) : null;
};

export const listApplications = async ({ status, cursor, limit }) => {
  const filter = status ? { status } : {};
  const page = await paginate(OrganicApplication, filter, {
    cursor,
    limit,
    populate: { path: "user", select: APPLICANT_FIELDS },
  });

  return { items: page.items.map(toApplicationView), nextCursor: page.nextCursor };
};

const NOTIFICATION_TYPE_BY_DECISION = { approved: "organic_approved", rejected: "organic_rejected" };

export const reviewApplication = async (reviewerId, applicationId, { decision, note }) => {
  const reviewed = await withTransaction(async (session) => {
    const application = await OrganicApplication.findOneAndUpdate(
      { _id: applicationId, status: "pending" },
      { $set: { status: decision, note, reviewedBy: reviewerId, reviewedAt: new Date() } },
      { returnDocument: "after", session }
    ).lean();

    if (!application) return null;

    if (decision === "approved") {
      await User.updateOne(
        { _id: application.user },
        { $set: { organicStatus: true, dogrulanmisSatici: true } },
        { session }
      );
    }

    return application;
  });

  if (!reviewed) {
    const exists = await OrganicApplication.exists({ _id: applicationId });
    throw exists ? conflict("Başvuru zaten incelenmiş", "ALREADY_REVIEWED") : applicationNotFound();
  }

  await recordNotification({
    recipient: reviewed.user,
    actor: reviewerId,
    type: NOTIFICATION_TYPE_BY_DECISION[decision],
    entity: { kind: "organic_application", id: reviewed._id },
    groupKey: `organic:${reviewed._id}`,
  });

  return toApplicationView(reviewed);
};

export const openDocument = async (requester, applicationId) => {
  if (!mongoose.isValidObjectId(applicationId)) throw applicationNotFound();

  const application = await OrganicApplication.findById(applicationId).lean();
  if (!application) throw applicationNotFound();

  const isOwner = application.user.toString() === requester.id;
  if (!isOwner && requester.role !== "admin") throw applicationNotFound();

  try {
    return { stream: await storage.readPrivate(application.documentKey), application };
  } catch (err) {
    logger.error({ err, applicationId }, "Başvuru belgesi okunamadı");
    throw notFound("Belge bulunamadı", "DOCUMENT_NOT_FOUND");
  }
};

export const removeApplicationsOf = async (userId, session) => {
  const applications = await OrganicApplication.find({ user: userId }, null, { session })
    .select("documentKey")
    .lean();
  await OrganicApplication.deleteMany({ user: userId }, { session });
  return applications.map((application) => application.documentKey);
};

export const discardDocuments = (keys) => Promise.all(keys.map(discardDocument));
