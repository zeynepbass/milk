import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./LoginForm";
import { renderWithProviders } from "@/test/render";
import { API, HttpResponse, buildUser, http, server } from "@/test/server";
import { useAuthStore } from "@/shared/store/useAuthStore";

describe("LoginForm", () => {
  it("geçersiz girdide sunucuya istek atmadan hata gösterir", async () => {
    let called = false;
    server.use(
      http.post(`${API}/auth/login`, () => {
        called = true;
        return HttpResponse.json({});
      })
    );

    renderWithProviders(<LoginForm />);
    await userEvent.type(screen.getByLabelText("E-posta"), "gecersiz");
    await userEvent.click(screen.getByRole("button", { name: "Giriş Yap" }));

    expect(await screen.findByText("Geçerli bir e-posta adresi giriniz")).toBeInTheDocument();
    expect(screen.getByText("Şifre zorunludur")).toBeInTheDocument();
    expect(screen.getByLabelText("E-posta")).toHaveAttribute("aria-invalid", "true");
    expect(called).toBe(false);
  });

  it("başarılı girişte oturumu başlatır ve ana sayfaya yönlendirir", async () => {
    const user = buildUser();
    let body;
    server.use(
      http.post(`${API}/auth/login`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ message: "Giriş başarılı", accessToken: "erisim", user });
      })
    );

    renderWithProviders(<LoginForm />);
    await userEvent.type(screen.getByLabelText("E-posta"), " Ayse@Ornek.com ");
    await userEvent.type(screen.getByLabelText("Parola"), "gizli-sifre");
    await userEvent.click(screen.getByRole("button", { name: "Giriş Yap" }));

    expect(await screen.findByText("Ana sayfa")).toBeInTheDocument();
    expect(body).toEqual({ email: "ayse@ornek.com", password: "gizli-sifre" });
    expect(useAuthStore.getState()).toMatchObject({
      status: "authenticated",
      accessToken: "erisim",
      userId: user._id,
    });
  });
});
