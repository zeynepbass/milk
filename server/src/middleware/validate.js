import { badRequest } from "../utils/AppError.js";

const toDetails = (location, issues) =>
  issues.map((issue) => ({
    location,
    path: issue.path.join("."),
    message: issue.message,
  }));

const assignQuery = (req, value) => {
  Object.defineProperty(req, "query", {
    value,
    writable: true,
    configurable: true,
    enumerable: true,
  });
};

export const parseOrThrow = (schema, value) => {
  const result = schema.safeParse(value);

  if (!result.success) {
    const details = toDetails("body", result.error.issues);
    throw badRequest(details[0].message, "VALIDATION_ERROR", details);
  }

  return result.data;
};

export const validate = (schemas) => (req, res, next) => {
  const details = [];
  const parsed = {};

  for (const location of ["params", "query", "body"]) {
    const schema = schemas[location];
    if (!schema) continue;

    const result = schema.safeParse(req[location] ?? {});

    if (result.success) {
      parsed[location] = result.data;
    } else {
      details.push(...toDetails(location, result.error.issues));
    }
  }

  if (details.length > 0) {
    return next(badRequest(details[0].message, "VALIDATION_ERROR", details));
  }

  if (parsed.params) req.params = parsed.params;
  if (parsed.body) req.body = parsed.body;
  if (parsed.query) assignQuery(req, parsed.query);

  return next();
};
