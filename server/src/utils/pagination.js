export const getLimit = (req, { defaultLimit = 50, maxLimit = 100 } = {}) => {
  const parsed = parseInt(req.query.limit, 10);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return defaultLimit;
  }

  return Math.min(parsed, maxLimit);
};
