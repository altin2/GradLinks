vi.mock("../supabase-Client.js", () => ({
  __esModule: true,
  default: {
    auth: {
      signInWithPassword: vi.fn(),
      signInWithOAuth: vi.fn().mockResolvedValue({ error: null }),
      getSession: vi.fn(),
    },
    storage: { from: vi.fn(() => ({ getPublicUrl: vi.fn() })) },
  },
}));
vi.mock("react-toastify", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));
vi.mock("ogl", () => {
  return {
    Renderer: vi.fn().mockImplementation(() => ({
      gl: {},
      setSize: vi.fn(),
      render: vi.fn(),
    })),
    Program: vi.fn().mockImplementation(() => ({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: { set: vi.fn() } },
        uHueShift: { value: 0 },
        uNoise: { value: 0 },
        uScan: { value: 0 },
        uScanFreq: { value: 0 },
        uWarp: { value: 0 },
      },
    })),
    Mesh: vi.fn(),
    Triangle: vi.fn(),
    Vec2: vi.fn().mockImplementation(() => ({ set: vi.fn() })),
  };
});
vi.mock("../../Pages/universal_components/DarkVeil", () => {
  return {
    default: () => <div data-testid="darkveil-mock" />,
  };
});
vi.mock("../Pages/Dashboard/components/NoticeBoardGraduate", () => ({
  __esModule: true,
  NoticeBoardGrad: () => <div data-testid="noticeboard-grad" />,
}));

vi.mock("../Pages/Dashboard/components/NoticeBoardEmployer", () => ({
  __esModule: true,
  NoticeBoardEmployer: () => <div data-testid="noticeboard-employer" />,
}));
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes, Navigate } from "react-router-dom";
import supabase from "../supabase-Client";
import Dashboard from "../Pages/Dashboard/Index";
import Login from "../Pages/LoginPg/Login/Index";
import "@testing-library/jest-dom";
import * as ProfileRoutes from "../Pages/Profile/components/functions/ProfileRoutes.tsx";

const setup = (auth: boolean, initial: string) => {
  const setAuth = vi.fn();
  const isAuthenticated = auth;
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <Routes>
        <Route
          path="/login"
          element={
            !isAuthenticated ? <Login setAuth={setAuth} /> : <Dashboard />
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <Dashboard /> : <Login setAuth={setAuth} />
          }
        />
      </Routes>
    </MemoryRouter>
  );
};
const renderGradDashboard = () => {
  (supabase.auth.getSession as vi.Mock).mockResolvedValue({
    data: {
      session: {
        user: {
          user_metadata: {
            isGrad: true,
          },
        },
        access_token: "token123",
      },
    },
    error: null,
  });
  vi.spyOn(ProfileRoutes, "returnGradStatus").mockResolvedValue(true);
  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );
};
const renderEmployerDashboard = () => {
  (supabase.auth.getSession as vi.Mock).mockResolvedValue({
    data: {
      session: {
        user: {
          user_metadata: {
            isGrad: false,
          },
        },
        access_token: "token123",
      },
    },
    error: null,
  });
  vi.spyOn(ProfileRoutes, "returnGradStatus").mockResolvedValue(false);
  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );
};

describe("User Entry permissions", () => {
  it("Should not allow users who aren't authenticated NOT to enter the dashboard", () => {
    setup(false, "/dashboard");
    expect(screen.getByText(/Login Page/i)).toBeInTheDocument();
  });
  it("Redirecting users who are already logged in back to the dashboard", async () => {
    const setAuth = vi.fn();
    const isAuthenticated = true;
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route
            path="/login"
            element={
              !isAuthenticated ? <Login setAuth={setAuth} /> : <Dashboard />
            }
          />
          <Route
            path="/dashboard"
            element={
              !isAuthenticated ? <Login setAuth={setAuth} /> : <Dashboard />
            }
          />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.queryByText(/Login Page/i)).not.toBeInTheDocument();
    });
  });
});
describe("Rendering Dashboard", () => {
  it("Should render all key components on the front page, for a graduate only", async () => {
    renderGradDashboard();
    const gradNoticeboard = await screen.findByTestId("noticeboard-grad");
    expect(gradNoticeboard).toBeInTheDocument();
    const findTalentItem = await screen.queryByTestId("dock-find-talent");
    expect(findTalentItem).not.toBeInTheDocument();
  });
  it("Should render all key components on the front page, for an employer only", async () => {
    renderEmployerDashboard();
    const empNoticeboard = await screen.findByTestId("noticeboard-employer");
    expect(empNoticeboard).toBeInTheDocument();
    const findTalentItem = await screen.findByTestId("dock-find-talent");
    expect(findTalentItem).toBeInTheDocument();

    //Lets any other things to render be rendered
    await waitFor(() => expect(true).toBe(true));
  });
});
