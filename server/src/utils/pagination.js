import mongoose from "mongoose";
import { badRequest } from "./AppError.js";

const invalidCursor = () => badRequest("Geçersiz sayfa imleci", "INVALID_CURSOR");

export const encodeCursor = (doc, field) =>
  Buffer.from(`${new Date(doc[field]).toISOString()}|${doc._id}`).toString("base64url");

export const decodeCursor = (cursor) => {
  if (!cursor) return null;

  const [isoDate, id] = Buffer.from(cursor, "base64url").toString("utf8").split("|");
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime()) || !mongoose.isValidObjectId(id)) {
    throw invalidCursor();
  }

  return { date, id: new mongoose.Types.ObjectId(id) };
};

const cursorCondition = (cursor, field) =>
  cursor
    ? {
        $or: [{ [field]: { $lt: cursor.date } }, { [field]: cursor.date, _id: { $lt: cursor.id } }],
      }
    : {};

export const paginate = async (model, filter, options = {}) => {
  const { cursor, limit, field = "createdAt", select, populate, projection } = options;
  const decoded = decodeCursor(cursor);
  const condition = cursorCondition(decoded, field);
  const query = decoded ? { $and: [filter, condition] } : filter;

  let request = model
    .find(query, projection)
    .sort({ [field]: -1, _id: -1 })
    .limit(limit + 1);

  if (select) request = request.select(select);
  if (populate) request = request.populate(populate);

  const docs = await request.lean();
  const hasMore = docs.length > limit;
  const items = hasMore ? docs.slice(0, limit) : docs;

  return {
    items,
    nextCursor: hasMore ? encodeCursor(items[items.length - 1], field) : null,
  };
};
