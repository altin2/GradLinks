import { vi } from "vitest";
import "@testing-library/jest-dom";

// Global mock for the supabase client
// Global mock for the supabase client
vi.mock("./supabase-Client.js", () => ({
  __esModule: true,
  default: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: { user: { id: "mock-user-id" } } },
      }),
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },

    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ data: [], error: null }),
      update: vi.fn().mockResolvedValue({ data: [], error: null }),
      delete: vi.fn().mockResolvedValue({ data: [], error: null }),
    })),

    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({ data: {}, error: null }),
        getPublicUrl: vi.fn(() => ({
          data: { publicUrl: "https://mock-storage-url" },
        })),
      })),
    },
  },
}));

