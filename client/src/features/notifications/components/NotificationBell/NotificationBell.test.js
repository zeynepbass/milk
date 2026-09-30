import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NotificationBell } from "./NotificationBell";
import { renderWithProviders } from "@/test/render";
import { API, HttpResponse, buildUser, http, page, server } from "@/test/server";

const notification = {
  _id: "n1",
  type: "post_like",
  message: "Mehmet Demir gönderini beğendi",
  isRead: false,
  entity: { kind: "post", id: "post-1" },
  lastActivityAt: "2026-09-30T10:00:00.000Z",
};

describe("NotificationBell", () => {
  it("okunmamış sayısını gösterir ve okundu işaretleyince azaltır", async () => {
    let marked = false;
    server.use(
      http.get(`${API}/notifications/unread-count`, () => HttpResponse.json({ unreadCount: marked ? 0 : 1 })),
      http.get(`${API}/notifications`, () => HttpResponse.json(page([notification]))),
      http.patch(`${API}/notifications/n1/read`, () => {
        marked = true;
        return HttpResponse.json({ success: true });
      })
    );

    renderWithProviders(<NotificationBell />, { user: buildUser() });

    const bell = await screen.findByRole("button", { name: "Bildirimler, 1 okunmamış" });
    await userEvent.click(bell);
    await userEvent.click(await screen.findByText("Mehmet Demir gönderini beğendi"));

    await waitFor(() => expect(marked).toBe(true));
    expect(await screen.findByRole("button", { name: "Bildirimler" })).toBeInTheDocument();
  });
});
