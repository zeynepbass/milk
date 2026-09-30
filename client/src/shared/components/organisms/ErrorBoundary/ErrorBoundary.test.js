import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorBoundary } from "./ErrorBoundary";

let shouldThrow = true;

function Unstable() {
  if (shouldThrow) throw new Error("patladı");
  return <p>İçerik</p>;
}

describe("ErrorBoundary", () => {
  it("hata yakalar ve tekrar denemeyle kurtulur", async () => {
    vi.spyOn(window, "dispatchEvent");
    const reportError = vi.spyOn(globalThis, "reportError").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <Unstable />
      </ErrorBoundary>
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Bir şeyler ters gitti");

    shouldThrow = false;
    await userEvent.click(screen.getByRole("button", { name: "Tekrar dene" }));
    expect(screen.getByText("İçerik")).toBeInTheDocument();

    reportError.mockRestore();
  });
});
