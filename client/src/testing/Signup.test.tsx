import React from "react";
import { toast } from "react-toastify";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import SignupUser from "../Pages/LoginPg/Signup/Index.tsx";
import "@testing-library/jest-dom";

/* eslint-env jest */
vi.mock("../supabase-Client.js", () => ({
  __esModule: true,
  default: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));
vi.mock("react-toastify", () => ({
  toast: { error: vi.fn() },
}));
vi.mock("../../../functions/Routes.tsx", () => ({
  passCheck: vi.fn((password: string) => {
    // Use the real implementation
    if (password.length === 0) {
      toast.error("Cannot leave password blank");
      return false;
    }
    if (password.length < 7) {
      toast.error("Pass must be more than 7 characters");
      return false;
    }
    if (![...password].some((c) => /[A-Z]/.test(c))) {
      toast.error("Pass must contain at least 1 uppercase letter");
      return false;
    }
    if (![...password].some((c) => /[a-z]/.test(c))) {
      toast.error("Pass must contain at least 1 lowercase letter");
      return false;
    }
    if (
      ![...password].some((c) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(c))
    ) {
      toast.error("Pass must contain at least 1 special symbol");
      return false;
    }
    return true;
  }),
}));

// mock props
const mockSetAuth = vi.fn();

const setup = () => {
  return render(
    <MemoryRouter>
      <SignupUser setAuth={mockSetAuth} />
    </MemoryRouter>
  );
};

describe("Ensuring everything renders properly", () => {
  it("renders email, phone, password and confirm password inputs", () => {
    setup();

    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("pass-input1");
    const confirmPasswordInput = screen.getByTestId("pass-input2");

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/Confirm your password/i)
    ).toBeInTheDocument();
  });

  it("allows typing into inputs", () => {
    setup();

    const emailInput = screen.getByPlaceholderText(/Email/i);
    const phoneInput = screen.getByPlaceholderText(/Phone number/i);
    const passwordInput = screen.getByPlaceholderText(/^Password$/i);
    const confirmPasswordInput = screen.getByPlaceholderText(
      /Confirm your password/i
    );

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(phoneInput, { target: { value: "1234567890" } });
    fireEvent.change(passwordInput, { target: { value: "MyPass123!" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "MyPass123!" } });

    expect((emailInput as HTMLInputElement).value).toBe("test@example.com");
    expect((phoneInput as HTMLInputElement).value).toBe("+1 (234) 567-890");
    expect((passwordInput as HTMLInputElement).value).toBe("MyPass123!");
    expect((confirmPasswordInput as HTMLInputElement).value).toBe("MyPass123!");
  });

  it("submits the form when clicking Sign Up", async () => {
    setup();
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ id: 1, email: "test@example.com" }),
      })
    );
    globalThis.fetch = mockFetch as any;

    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("pass-input1");
    const confirmPasswordInput = screen.getByTestId("pass-input2");

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();

    const submitButton = screen.getByRole("button", { name: /Sign Up/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "MyPass123!" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "MyPass123!" } });

    fireEvent.click(submitButton);

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:5000/auth/signup",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-type": "application/json" },
      })
    );
    await waitFor(() =>
      expect(
        screen.getByText(/Registered! Verify with email./i)
      ).toBeInTheDocument()
    );
  });
});

describe("Testing Valid and Invalid test cases", () => {
  const validTestCases = [
    {
      name: "valid user signup 1",
      email: "a_b@c.de",
      password: "Aa123!!!",
      confirmPassword: "Aa123!!!",
    },
    {
      name: "valid user signup 2",
      email: "user2@gmail.com",
      password: "AnotherPass456!",
      confirmPassword: "AnotherPass456!",
    },
    {
      name: "valid user signup 3",
      email: "abc@xyz.12",
      password: "P@ssword789!",
      confirmPassword: "P@ssword789!",
    },
  ];
  const invalidTestCases = [
    {
      name: "password too short",
      email: "user1@example.com",
      password: "short",
      confirmPassword: "short",
      frontEndInvalid: true,
      expectedToast: "Pass must be more than 7 characters",
    },
    {
      name: "password missing uppercase",
      email: "user2@example.com",
      password: "lowercase1!",
      confirmPassword: "lowercase1!",
      frontEndInvalid: true,
      expectedToast: "Pass must contain at least 1 uppercase letter",
    },
    {
      name: "passwords do not match",
      email: "user3@example.com",
      password: "MyPass123!",
      confirmPassword: "Different123!",
      frontEndInvalid: true,
      expectedToast: "Passwords do not match.",
    },
    {
      name: "server rejects email",
      email: "existing@example.com",
      password: "MyPass123!",
      confirmPassword: "MyPass123!",
      frontEndInvalid: false,
      serverResponse: {
        ok: false,
        status: 401,
        message: "Email already exists",
      },
      expectedToast: "Email already exists",
    },
    {
      name: "Email in use",
      email: "altin.mackinnon@gmail.com",
      password: "Lowercase1!",
      confirmPassword: "Lowercase1!",
      frontEndInvalid: false,
      serverResponse: {
        ok: false,
        status: 401,
        message: "Email already exists",
      },
      expectedToast: "Email already exists",
    },
  ];

  it.each(validTestCases)(
    "submits the form correctly for %s",
    async ({ email, password, confirmPassword }) => {
      setup();

      const mockFetch = vi.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ id: 1, email }),
        })
      );
      globalThis.fetch = mockFetch as any;

      const emailInput = screen.getByTestId("email-input");
      const passwordInput = screen.getByTestId("pass-input1");
      const confirmPasswordInput = screen.getByTestId("pass-input2");
      const submitButton = screen.getByRole("button", { name: /sign up/i });

      // simulate typing
      fireEvent.change(emailInput, { target: { value: email } });
      fireEvent.change(passwordInput, { target: { value: password } });
      fireEvent.change(confirmPasswordInput, {
        target: { value: confirmPassword },
      });

      fireEvent.click(submitButton);

      // Assert fetch was called with correct payload
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:5000/auth/signup",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: expect.stringContaining(email), // checks the body includes the right email
        })
      );

      await waitFor(() =>
        expect(
          screen.getByText(/Registered! Verify with email./i)
        ).toBeInTheDocument()
      );
    }
  );
  it.each(invalidTestCases)("$name", async (testCase) => {
    const {
      email,
      password,
      confirmPassword,
      frontEndInvalid,
      serverResponse,
      expectedToast,
    } = testCase;

    // Mock fetch
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: serverResponse?.ok ?? true,
        status: serverResponse?.status ?? 200,
        json: () =>
          Promise.resolve(serverResponse?.message ?? { id: 1, email }),
      })
    );
    globalThis.fetch = mockFetch as any;

    setup();

    // Inputs
    fireEvent.change(screen.getByTestId("email-input"), {
      target: { value: email },
    });
    fireEvent.change(screen.getByTestId("pass-input1"), {
      target: { value: password },
    });
    fireEvent.change(screen.getByTestId("pass-input2"), {
      target: { value: confirmPassword },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    //Confirms frontend error for password checking
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expectedToast);
    });

    if (frontEndInvalid) {
      // fetch should NOT be called for front-end invalid passwords
      expect(mockFetch).not.toHaveBeenCalled();
    } else {
      // fetch should be called for server-side error
      expect(mockFetch).toHaveBeenCalled();
    }
  });
});
