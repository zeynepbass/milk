import { z } from "zod";
import { listOperations } from "./registry.js";

const toJsonSchema = (schema) => z.toJSONSchema(schema, { io: "input", unrepresentable: "any" });

const toOpenApiPath = (path) => path.replace(/:(\w+)/g, "{$1}");

const toParameters = (schema, location) => {
  if (!schema) return [];

  const json = toJsonSchema(schema);
  const required = new Set(json.required ?? []);

  return Object.entries(json.properties ?? {}).map(([name, property]) => ({
    name,
    in: location,
    required: location === "path" || required.has(name),
    schema: property,
  }));
};

const toRequestBody = (operation) => {
  const { schemas = {}, files } = operation;
  if (!schemas.body && !files) return undefined;

  if (files) {
    const json = schemas.body ? toJsonSchema(schemas.body) : { type: "object", properties: {} };
    const fileProperty = { type: "string", format: "binary" };

    return {
      required: true,
      content: {
        "multipart/form-data": {
          schema: {
            ...json,
            properties: {
              ...json.properties,
              [files.field]: files.multiple ? { type: "array", items: fileProperty } : fileProperty,
            },
          },
        },
      },
    };
  }

  return { required: true, content: { "application/json": { schema: toJsonSchema(schemas.body) } } };
};

const ERROR_RESPONSE = { $ref: "#/components/responses/Error" };

const toResponses = (operation) => ({
  [operation.status ?? 200]: { description: "Başarılı" },
  ...(operation.schemas ? { 400: ERROR_RESPONSE } : {}),
  ...(operation.auth ? { 401: ERROR_RESPONSE } : {}),
  ...(operation.auth === "admin" ? { 403: ERROR_RESPONSE } : {}),
  500: ERROR_RESPONSE,
});

const toOperation = (operation) => ({
  tags: [operation.tag],
  summary: operation.summary,
  operationId: `${operation.method}_${operation.path.replace(/[^\w]+/g, "_")}`,
  security: operation.auth === "required" || operation.auth === "admin" ? [{ bearerAuth: [] }] : [],
  parameters: [
    ...toParameters(operation.schemas?.params, "path"),
    ...toParameters(operation.schemas?.query, "query"),
  ],
  requestBody: toRequestBody(operation),
  responses: toResponses(operation),
});

export const buildOpenApiDocument = () => {
  const paths = {};

  for (const operation of listOperations()) {
    const path = toOpenApiPath(operation.path);
    paths[path] = { ...paths[path], [operation.method]: toOperation(operation) };
  }

  return {
    openapi: "3.1.0",
    info: {
      title: "Milk API",
      version: "1.0.0",
      description: "Yerel üretici ve tüketicileri buluşturan pazar platformunun REST API'si.",
    },
    servers: [{ url: "/" }],
    components: {
      securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } },
      responses: {
        Error: {
          description: "Hata",
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["message", "code"],
                properties: {
                  message: { type: "string" },
                  code: { type: "string" },
                  requestId: { type: "string" },
                  details: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        location: { type: "string" },
                        path: { type: "string" },
                        message: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    paths,
  };
};

export const SWAGGER_UI_HTML = `<!doctype html>
<html lang="tr">
  <head>
    <meta charset="utf-8" />
    <title>Milk API</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script src="/api/docs/init.js"></script>
  </body>
</html>`;

export const SWAGGER_INIT_JS = `window.ui = SwaggerUIBundle({ url: "/api/docs/openapi.json", dom_id: "#swagger" });`;
