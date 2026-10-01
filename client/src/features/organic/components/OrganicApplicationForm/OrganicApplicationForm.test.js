import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OrganicApplicationForm } from "./OrganicApplicationForm";
import { renderWithProviders } from "@/test/render";
import { API, HttpResponse, buildUser, http, server } from "@/test/server";

const seller = buildUser({ role: "satici" });
const pdf = () => new File(["%PDF-1.4"], "sertifika.pdf", { type: "application/pdf" });

const selectFile = (file) => {
  const input = document.querySelector('input[type="file"]');
  return userEvent.upload(input, file, { applyAccept: false });
};

describe("OrganicApplicationForm", () => {
  it("başvuru yoksa PDF yükleyip başvurur ve bekleyen durumu gösterir", async () => {
    let uploaded;
    server.use(
      http.get(`${API}/organic-applications/mine`, () => HttpResponse.json({ application: null })),
      http.post(`${API}/organic-applications`, async ({ request }) => {
        uploaded = (await request.formData()).get("document");
        return HttpResponse.json(
          {
            message: "Başvurun alındı",
            application: { _id: "a1", status: "pending", createdAt: "2026-10-01T10:00:00.000Z" },
          },
          { status: 201 }
        );
      })
    );

    renderWithProviders(<OrganicApplicationForm canApply />, { user: seller });

    await screen.findByRole("button", { name: "Başvur" });
    await selectFile(pdf());
    await userEvent.click(screen.getByRole("button", { name: "Başvur" }));

    expect(await screen.findByText("Başvurun inceleniyor")).toBeInTheDocument();
    expect(uploaded.size).toBeGreaterThan(0);
    expect(screen.queryByRole("button", { name: "Başvur" })).not.toBeInTheDocument();
  });

  it("PDF olmayan dosyada hata gösterir ve göndermez", async () => {
    server.use(http.get(`${API}/organic-applications/mine`, () => HttpResponse.json({ application: null })));

    renderWithProviders(<OrganicApplicationForm canApply />, { user: seller });

    await screen.findByRole("button", { name: "Başvur" });
    await selectFile(new File(["x"], "foto.png", { type: "image/png" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Sadece PDF belgeler yüklenebilir");
    expect(screen.getByRole("button", { name: "Başvur" })).toBeDisabled();
  });

  it("reddedilen başvurunun gerekçesini gösterir ve yeniden başvuruya izin verir", async () => {
    server.use(
      http.get(`${API}/organic-applications/mine`, () =>
        HttpResponse.json({
          application: {
            _id: "a1",
            status: "rejected",
            note: "Belge okunaklı değil",
            createdAt: "2026-10-01T10:00:00.000Z",
          },
        })
      )
    );

    renderWithProviders(<OrganicApplicationForm canApply />, { user: seller });

    expect(await screen.findByText("Başvurun reddedildi")).toBeInTheDocument();
    expect(screen.getByText(/Belge okunaklı değil/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Başvur" })).toBeInTheDocument();
  });

  it("alıcıya başvuru formu göstermez", async () => {
    server.use(http.get(`${API}/organic-applications/mine`, () => HttpResponse.json({ application: null })));

    renderWithProviders(<OrganicApplicationForm canApply={false} />, { user: buildUser() });

    expect(await screen.findByText("Başvuru yalnızca satıcı hesapları içindir.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Başvur" })).not.toBeInTheDocument();
  });
});
