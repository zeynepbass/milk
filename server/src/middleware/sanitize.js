const isUnsafeKey = (key) => key.startsWith("$") || key.includes(".");

export const stripOperatorKeys = (value) => {
  if (Array.isArray(value)) {
    return value.map(stripOperatorKeys);
  }

  if (value && typeof value === "object" && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !isUnsafeKey(key))
        .map(([key, nested]) => [key, stripOperatorKeys(nested)])
    );
  }

  return value;
};

export const sanitizeRequest = (req, res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = stripOperatorKeys(req.body);
  }

  next();
};
