import React from "react";
import { toast } from "react-toastify";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import supabase from "../supabase-Client";
import { MemoryRouter } from "react-router-dom";
import Login from "../Pages/LoginPg/Login/Index";
import "@testing-library/jest-dom";

/* eslint-env jest */
vi.mock("../supabase-Client.js", () => ({
  __esModule: true,
  default: {
    auth: {
      signInWithPassword: vi.fn(),
      signInWithOAuth: vi.fn().mockResolvedValue({ error: null }),
    },
  },
}));
vi.mock("react-toastify", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));
const mockSetAuth = vi.fn();

const setup = () => {
  return render(
    <MemoryRouter>
      <Login setAuth={mockSetAuth} />
    </MemoryRouter>
  );
};
describe("Ensuring everything renders properly", () => {
  it("renders email, password and oAuth inputs", () => {
    setup();

    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("pass-input1");
    const oAuthGoogle = screen.getByTestId("oAuthGoogle");
    const oAuthLinkedIn = screen.getByTestId("oAuthLinkedIn");
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(oAuthGoogle).toBeInTheDocument();
    expect(oAuthLinkedIn).toBeInTheDocument();
  });
  it("allows typing into inputs", () => {
    setup();

    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("pass-input1");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "MyPass123!" } });

    expect((emailInput as HTMLInputElement).value).toBe("test@example.com");
    expect((passwordInput as HTMLInputElement).value).toBe("MyPass123!");
  });
});
describe("Testing Valid and Invalid test cases", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("Make sure login is being called when signing manually", async () => {
    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      data: null,
      error: { message: "Invalid login credentials" },
    });
    const setAuth = vi.fn();
    render(
      <MemoryRouter>
        <Login setAuth={setAuth} />
      </MemoryRouter>
    );
    const email = "altin.mackinnon@gmail.com";
    const password = "Aa123!!!";

    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("pass-input1");
    const submitButton = screen.getByRole("button", { name: /Log In/i });
    fireEvent.change(emailInput, { target: { value: email } });
    fireEvent.change(passwordInput, { target: { value: password } });

    fireEvent.click(submitButton);
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email,
      password,
    });
  });
  it("Handling oAuth", async () => {
    setup();
    const oAuthGoogle = screen.getByRole("img", { name: /Google Sign In/i });
    const oAuthLinkedIn = screen.getByRole("img", {
      name: /LinkedIn Sign In/i,
    });
    fireEvent.click(oAuthGoogle);
    expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
    });
    fireEvent.click(oAuthLinkedIn);
    expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: "linkedin_oidc",
    });
  });
});
