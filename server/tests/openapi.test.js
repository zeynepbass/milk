import { describe, expect, it } from "vitest";
import { api } from "./helpers.js";

describe("OpenAPI dokümantasyonu", () => {
  it("tüm uçları zod şemalarından üretir", async () => {
    const response = await api().get("/api/docs/openapi.json");

    expect(response.status).toBe(200);
    expect(response.body.openapi).toBe("3.1.0");

    const { paths } = response.body;
    expect(paths["/api/auth/login"].post.requestBody.content["application/json"].schema.required).toEqual(
      expect.arrayContaining(["email", "password"])
    );
    expect(paths["/api/posts/{id}"].patch.requestBody.content["multipart/form-data"]).toBeDefined();
    expect(paths["/api/posts"].get.parameters.map((parameter) => parameter.name)).toEqual(
      expect.arrayContaining(["cursor", "limit", "category"])
    );
    expect(paths["/api/users/me"].get.security).toEqual([{ bearerAuth: [] }]);
    expect(Object.keys(paths).length).toBeGreaterThan(30);
  });

  it("Swagger arayüzünü sunar", async () => {
    const response = await api().get("/api/docs");

    expect(response.status).toBe(200);
    expect(response.headers["content-security-policy"]).toContain("unpkg.com");
  });
});
