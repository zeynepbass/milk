import express from "express";
import { adminOnly, authMiddleware, optionalAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { registerOperation } from "../docs/registry.js";

const AUTH_MIDDLEWARES = {
  required: [authMiddleware],
  optional: [optionalAuth],
  admin: [authMiddleware, adminOnly],
};

export const defineRoutes = (basePath, tag) => {
  const router = express.Router();

  const add =
    (method) =>
    (path, { summary, auth = "required", schemas, before = [], files, status }, handler) => {
      const middlewares = [
        ...(AUTH_MIDDLEWARES[auth] ?? []),
        ...before,
        ...(schemas ? [validate(schemas)] : []),
        handler,
      ];

      router[method](path, ...middlewares);
      registerOperation({
        method,
        path: `${basePath}${path === "/" ? "" : path}`,
        tag,
        summary,
        auth,
        schemas,
        files,
        status,
      });
    };

  return {
    router,
    get: add("get"),
    post: add("post"),
    put: add("put"),
    patch: add("patch"),
    delete: add("delete"),
  };
};
