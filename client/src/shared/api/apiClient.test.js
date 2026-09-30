import { describe, expect, it } from "vitest";
import apiClient from "./apiClient";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { API, HttpResponse, http, server } from "@/test/server";

describe("apiClient", () => {
  it("süresi dolan token'ı yenileyip isteği tekrarlar", async () => {
    useAuthStore.setState({ status: "authenticated", accessToken: "eski", userId: "u1" });
    let refreshCalls = 0;

    server.use(
      http.get(`${API}/users/me`, ({ request }) =>
        request.headers.get("authorization") === "Bearer yeni"
          ? HttpResponse.json({ _id: "u1" })
          : HttpResponse.json({ code: "TOKEN_EXPIRED", message: "Oturum süresi doldu" }, { status: 401 })
      ),
      http.post(`${API}/auth/refresh`, () => {
        refreshCalls += 1;
        return HttpResponse.json({ accessToken: "yeni", user: { _id: "u1" } });
      })
    );

    const response = await apiClient.get("/users/me");

    expect(response.data).toEqual({ _id: "u1" });
    expect(refreshCalls).toBe(1);
    expect(useAuthStore.getState().accessToken).toBe("yeni");
  });

  it("eşzamanlı 401 yanıtlarında tek refresh isteği yapar", async () => {
    useAuthStore.setState({ status: "authenticated", accessToken: "eski", userId: "u1" });
    let refreshCalls = 0;

    server.use(
      http.get(`${API}/posts`, ({ request }) =>
        request.headers.get("authorization") === "Bearer yeni"
          ? HttpResponse.json({ items: [], nextCursor: null })
          : HttpResponse.json({ code: "TOKEN_EXPIRED" }, { status: 401 })
      ),
      http.post(`${API}/auth/refresh`, async () => {
        refreshCalls += 1;
        return HttpResponse.json({ accessToken: "yeni", user: { _id: "u1" } });
      })
    );

    await Promise.all([apiClient.get("/posts"), apiClient.get("/posts"), apiClient.get("/posts")]);

    expect(refreshCalls).toBe(1);
  });

  it("refresh başarısız olursa oturumu kapatır", async () => {
    useAuthStore.setState({ status: "authenticated", accessToken: "eski", userId: "u1" });

    server.use(
      http.get(`${API}/users/me`, () => HttpResponse.json({ code: "TOKEN_EXPIRED" }, { status: 401 })),
      http.post(`${API}/auth/refresh`, () => HttpResponse.json({ code: "REFRESH_INVALID" }, { status: 401 }))
    );

    await expect(apiClient.get("/users/me")).rejects.toBeTruthy();
    expect(useAuthStore.getState().status).toBe("anonymous");
  });

  it("dondurulmuş hesapta refresh denemeden oturumu kapatır", async () => {
    useAuthStore.setState({ status: "authenticated", accessToken: "eski", userId: "u1" });

    server.use(http.get(`${API}/users/me`, () => HttpResponse.json({ code: "ACCOUNT_FROZEN" }, { status: 401 })));

    await expect(apiClient.get("/users/me")).rejects.toBeTruthy();
    expect(useAuthStore.getState().status).toBe("anonymous");
  });
});
