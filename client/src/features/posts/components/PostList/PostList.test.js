import { describe, expect, it } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PostList } from "./PostList";
import { usePostFeed } from "../../hooks/usePostQueries";
import { renderWithProviders } from "@/test/render";
import { API, HttpResponse, buildPost, buildUser, http, page, server } from "@/test/server";

function ExploreList() {
  const query = usePostFeed("explore");
  return <PostList query={query} emptyTitle="Boş" emptyDescription="Gönderi yok" />;
}

const me = buildUser();

describe("PostList", () => {
  it("cursor ile sonraki sayfayı yükler", async () => {
    server.use(
      http.get(`${API}/posts`, ({ request }) =>
        new URL(request.url).searchParams.get("cursor") === "c2"
          ? HttpResponse.json(page([buildPost({ _id: "p2", title: "Bal" })]))
          : HttpResponse.json(page([buildPost({ _id: "p1", title: "Süt" })], "c2"))
      )
    );

    renderWithProviders(<ExploreList />, { user: me });

    expect(await screen.findByText("Süt")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Daha fazla göster" }));

    expect(await screen.findByText("Bal")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Daha fazla göster" })).not.toBeInTheDocument();
  });

  it("boş listede boş durum gösterir", async () => {
    server.use(http.get(`${API}/posts`, () => HttpResponse.json(page([]))));

    renderWithProviders(<ExploreList />, { user: me });

    expect(await screen.findByText("Gönderi yok")).toBeInTheDocument();
  });

  it("hata durumunda tekrar deneme sunar", async () => {
    let attempts = 0;
    server.use(
      http.get(`${API}/posts`, () => {
        attempts += 1;
        return attempts === 1
          ? HttpResponse.json({ message: "Geçici hata" }, { status: 400 })
          : HttpResponse.json(page([buildPost()]));
      })
    );

    renderWithProviders(<ExploreList />, { user: me });

    expect(await screen.findByRole("alert")).toHaveTextContent("Geçici hata");
    await userEvent.click(screen.getByRole("button", { name: "Tekrar dene" }));
    expect(await screen.findByText("Taze süt")).toBeInTheDocument();
  });

  it("beğeniyi iyimser olarak günceller ve hata olursa geri alır", async () => {
    let resolveLike;
    server.use(
      http.get(`${API}/posts`, () => HttpResponse.json(page([buildPost({ likesCount: 2 })]))),
      http.put(
        `${API}/posts/post-1/like`,
        () =>
          new Promise((resolve) => {
            resolveLike = () => resolve(HttpResponse.json({ message: "Hata" }, { status: 400 }));
          })
      )
    );

    renderWithProviders(<ExploreList />, { user: me });
    const likeButton = await screen.findByRole("button", { name: "Beğen" });

    await userEvent.click(likeButton);
    const optimistic = screen.getByRole("button", { name: "Beğeniyi geri al" });
    expect(optimistic).toHaveAttribute("aria-pressed", "true");
    expect(within(optimistic).getByText("3")).toBeInTheDocument();

    resolveLike();
    await waitFor(() => expect(screen.getByRole("button", { name: "Beğen" })).toHaveTextContent("2"));
  });

  it("satıcıyla mesajlaş butonu ürün bilgisini state ile taşır", async () => {
    server.use(http.get(`${API}/posts`, () => HttpResponse.json(page([buildPost()]))));

    renderWithProviders(<ExploreList />, { user: me });
    await userEvent.click(await screen.findByRole("button", { name: "Mehmet Demir ile mesajlaş" }));

    expect(await screen.findByText("Mesajlar sayfası")).toBeInTheDocument();
    expect(window.localStorage.getItem("product")).toBeNull();
  });
});
