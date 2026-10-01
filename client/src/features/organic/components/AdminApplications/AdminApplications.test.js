import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminApplications } from "./AdminApplications";
import { renderWithProviders } from "@/test/render";
import { API, HttpResponse, buildUser, http, page, server } from "@/test/server";

const admin = buildUser({ _id: "admin-1", role: "admin" });

const pendingApplication = {
  _id: "a1",
  status: "pending",
  originalName: "sertifika.pdf",
  createdAt: "2026-10-01T10:00:00.000Z",
  user: { _id: "s1", name: "Mehmet", surname: "Demir", email: "mehmet@ornek.com", province: "İzmir" },
};

describe("AdminApplications", () => {
  it("yönetici olmayan kullanıcıya erişim vermez", async () => {
    renderWithProviders(<AdminApplications />, { user: buildUser({ role: "satici" }) });

    expect(await screen.findByText("Erişim yok")).toBeInTheDocument();
  });

  it("reddetmek için gerekçe ister, onaylanınca başvuruyu listeden çıkarır", async () => {
    let reviewBody;
    server.use(
      http.get(`${API}/organic-applications`, ({ request }) =>
        HttpResponse.json(
          page(
            new URL(request.url).searchParams.get("status") === "pending" && !reviewBody
              ? [pendingApplication]
              : []
          )
        )
      ),
      http.patch(`${API}/organic-applications/a1`, async ({ request }) => {
        reviewBody = await request.json();
        return HttpResponse.json({ application: { ...pendingApplication, status: "approved" } });
      })
    );

    renderWithProviders(<AdminApplications />, { user: admin });

    expect(await screen.findByRole("heading", { name: "Mehmet Demir" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Reddet" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Reddetme gerekçesi zorunludur");
    expect(reviewBody).toBeUndefined();

    await userEvent.click(screen.getByRole("button", { name: "Onayla" }));

    await waitFor(() => expect(reviewBody).toEqual({ decision: "approved" }));
    expect(await screen.findByText("Başvuru yok")).toBeInTheDocument();
  });
});
