import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as auth from "../api/auth";
import { AccountSecurityPage } from "./AccountSecurityPage";

vi.mock("../api/auth", () => ({
  getReauthenticationStatus: vi.fn(), beginReauthentication: vi.fn(), verifyReauthentication: vi.fn(),
  getSecuritySummary: vi.fn(), getAuthSessions: vi.fn(), getSecurityEvents: vi.fn(),
  revokeAuthSession: vi.fn(), revokeOtherSessions: vi.fn(), regenerateRecoveryCodes: vi.fn(),
  setup2FA: vi.fn(), verifySetup2FA: vi.fn(), disable2FA: vi.fn(),
}));

const summary = { email: "admin@example.test", twoFactorEnabled: true, recoveryCodesRemaining: 8, previousLogin: { at: 1_720_000_000, ipAddress: "10.0.0.2", deviceLabel: "Chrome on Windows" } };
const securityEvent = { id: "event-123", type: "login_failure", outcome: "failure", createdAt: 1_720_000_000, ipAddress: "10.0.0.2", deviceLabel: "Chrome on Windows", details: { locked: true, attemptCount: 5, factors: ["password", "totp"], context: { purpose: "login" } } };

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location">{`${location.pathname}${location.search}`}</output>;
}

function renderPage() {
  return render(<MemoryRouter initialEntries={["/?profile=1&view=admin&section=security"]}><Routes><Route path="/" element={<><AccountSecurityPage /><LocationProbe /></>} /></Routes></MemoryRouter>);
}

describe("AccountSecurityPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auth.getSecuritySummary).mockResolvedValue(summary);
    vi.mocked(auth.getAuthSessions).mockResolvedValue([{ id: "current", current: true, createdAt: 1_720_000_000, lastSeenAt: 1_720_000_100, expiresAt: 1_725_000_000, ipAddress: "10.0.0.2", deviceLabel: "Chrome on Windows" }]);
    vi.mocked(auth.getSecurityEvents).mockResolvedValue({ events: [securityEvent], nextCursor: null });
  });

  it("requires server-side reauthentication before loading sensitive details", async () => {
    vi.mocked(auth.getReauthenticationStatus).mockResolvedValue({ reauthenticated: false, remainingSeconds: 0 });
    vi.mocked(auth.beginReauthentication).mockResolvedValue({ requires2fa: true, challengeToken: "challenge", expiresInSeconds: 300, email: "admin@example.test", message: "TOTP required" });
    vi.mocked(auth.verifyReauthentication).mockResolvedValue({ reauthenticated: true, validForSeconds: 600 });
    renderPage();
    expect(await screen.findByRole("heading", { name: "Confirm your identity" })).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "secret" } });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(await screen.findByLabelText("Authenticator code")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Authenticator code"), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: "Verify factor" }));
    expect(await screen.findByText("Active sessions")).toBeTruthy();
    expect(auth.verifyReauthentication).toHaveBeenCalledWith({ challengeToken: "challenge", method: "totp", code: "123456" });
  });

  it("shows sessions, previous login, recovery count, and audit activity after fresh reauthentication", async () => {
    vi.mocked(auth.getReauthenticationStatus).mockResolvedValue({ reauthenticated: true, remainingSeconds: 500 });
    renderPage();
    expect(await screen.findByText("8 codes remaining")).toBeTruthy();
    expect(screen.getAllByText("Chrome on Windows").length).toBeGreaterThan(0);
    expect(screen.getByText("Login Failure")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    await waitFor(() => expect(screen.getByTestId("location").textContent).toBe("/?profile=1&view=admin&section=account"));
  });

  it("opens complete event details and restores focus when closed", async () => {
    vi.mocked(auth.getReauthenticationStatus).mockResolvedValue({ reauthenticated: true, remainingSeconds: 500 });
    renderPage();
    const eventButton = await screen.findByRole("button", { name: /Login Failure/ });
    eventButton.focus();
    fireEvent.click(eventButton);
    const dialog = await screen.findByRole("dialog", { name: "Login Failure" });
    expect(within(dialog).getByText("event-123")).toBeTruthy();
    expect(within(dialog).getByText("login_failure")).toBeTruthy();
    expect(within(dialog).getByText("10.0.0.2")).toBeTruthy();
    expect(within(dialog).getByText("Attempt Count")).toBeTruthy();
    expect(within(dialog).getByText("5")).toBeTruthy();
    expect(within(dialog).getByText(/"purpose": "login"/)).toBeTruthy();
    const closeButton = within(dialog).getByRole("button", { name: "Close activity details" });
    expect(document.activeElement).toBe(closeButton);
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.keyDown(window, { key: "Tab" });
    expect(document.activeElement).toBe(closeButton);
    fireEvent.click(closeButton);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(eventButton);
    expect(document.body.style.overflow).toBe("");
  });

  it("closes with Escape and explains when an event has no additional metadata", async () => {
    vi.mocked(auth.getReauthenticationStatus).mockResolvedValue({ reauthenticated: true, remainingSeconds: 500 });
    vi.mocked(auth.getSecurityEvents).mockResolvedValue({ events: [{ ...securityEvent, details: null }], nextCursor: null });
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: /Login Failure/ }));
    expect(await screen.findByText("No additional metadata was recorded for this activity.")).toBeTruthy();
    fireEvent.keyDown(window, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });
});
