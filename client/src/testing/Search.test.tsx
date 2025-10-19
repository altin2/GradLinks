// In your test setup or at the top of the test file
vi.mock("./supabase-Client.js", () => {
  const mockFromFn = vi.fn(() => ({
    select: vi.fn().mockResolvedValue({ data: [], error: null }),
    insert: vi.fn().mockResolvedValue({ data: [], error: null }),
    update: vi.fn().mockResolvedValue({ data: [], error: null }),
    delete: vi.fn().mockResolvedValue({ data: [], error: null }),
  }));

  const mockStorage = {
    from: vi.fn(() => ({
      upload: vi.fn().mockResolvedValue({ data: {}, error: null }),
      getPublicUrl: vi.fn(() => ({
        data: { publicUrl: "https://mock-storage-url" },
      })),
    })),
  };

  const mockAuth = {
    getSession: vi.fn().mockResolvedValue({
      data: { session: { user: { id: "mock-user-id" } } },
    }),
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
  };

  return {
    __esModule: true,
    default: {
      from: mockFromFn,
      storage: mockStorage,
      auth: mockAuth,
    },
  };
});

import { toast } from "react-toastify";

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));
import {
  render,
  screen,
  fireEvent,
  waitFor,
  getByTestId,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import supabase from "../supabase-Client";
import SearchPage from "../Pages/SearchAlgorithm/Index";
import { SearchAlgoInputForm } from "../Pages/SearchAlgorithm/components/SearchAlgoForm";
import * as AlgoAPI from "../Pages/SearchAlgorithm/components/functions/RelevanceAlgorithm";
import * as NotifAPI from "../Pages/Notifications/components/functions/NotificationRoutes";
import { ResultsTable } from "../Pages/SearchAlgorithm/components/ResultsComponent";
const setupSearchForm = () => {
  render(
    <MemoryRouter>
      <SearchAlgoInputForm />
    </MemoryRouter>
  );
};

describe("Ensuring everything renders properly", () => {
  it("Should render all the inputs", async () => {
    setupSearchForm();
    for (let i = 0; i < 5; i++) {
      screen.debug();
      expect(await screen.findByTestId(`steps${i}`)).toBeCalled;
      fireEvent.click(await screen.findByTestId("btnRight"));
    }
  });
  it("Should all the relevance algorithm when submitted", async () => {
    setupSearchForm();
    vi.spyOn(AlgoAPI, "RelevanceAlgorithm");
    const Select = await screen.findByTestId("Select-steps0");
    //fill in all required inputs.
    fireEvent.change(Select, {
      target: {
        name: "degree_type",
        value: "No formal education",
      },
    });
    fireEvent.click(await screen.findByTestId("btnRight"));
    fireEvent.click(await screen.findByTestId("btnRight"));
    fireEvent.click(
      await screen.findByRole("button", { name: /---Click to show skills---/i })
    );
    const Skill = await screen.findByTestId("imgSelect-1");
    fireEvent.click(Skill);
    fireEvent.click(await screen.findByTestId("btnLeft"));
    for (let i = 0; i < 4; i++) {
      fireEvent.click(await screen.findByTestId("btnRight"));
    }
    fireEvent.click(await screen.findByTestId("steps4-submit"));
    await waitFor(() => {
      expect(AlgoAPI.RelevanceAlgorithm).toHaveBeenCalled();
    });
  });
});
describe("Testing the inputs", () => {
  const years = [
    { year: -1, sign: "<" },
    { year: 0, sign: ">" },
    { year: 20, sign: "<=" },
    { year: 10, sign: ">=" },
    { year: 101, sign: "<" },
    { year: 10, year2: 100, sign: "<>" },
    { year: 100, year2: 10, sign: "<>" },
  ];
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it.each(years)("Test for work year %s", async (year) => {
    setupSearchForm();
    const Select = await screen.findByTestId("Select-steps0");
    //fill in all required inputs.
    fireEvent.change(Select, {
      target: {
        name: "degree_type",
        value: "No formal education",
      },
    });
    fireEvent.click(await screen.findByTestId("btnRight"));
    fireEvent.click(await screen.findByTestId("btnRight"));
    fireEvent.click(
      await screen.findByRole("button", { name: /---Click to show skills---/i })
    );
    const Skill = await screen.findByTestId("imgSelect-1");
    fireEvent.click(Skill);
    fireEvent.click(await screen.findByTestId("btnLeft"));

    const SelectSign = await screen.findByTestId("Select-steps1");
    fireEvent.change(SelectSign, {
      target: { name: "sign", value: year.sign },
    });
    //Assume all the required fields have been filled out.
    if (year.sign !== "<>") {
      const YearComp = await screen.findByTestId("workYear");
      fireEvent.change(YearComp, {
        target: { name: "work_years", value: year.year },
      });
      for (let i = 0; i < 3; i++) {
        fireEvent.click(await screen.findByTestId("btnRight"));
      }
      fireEvent.click(await screen.findByTestId("steps4-submit"));
      if (year.year > 100 || year.year < 0) {
        expect(toast.error).toHaveBeenCalled();
      } else {
        expect(toast.error).not.toHaveBeenCalled();
      }
    } else {
      screen.debug();
      const Year1 = await screen.findByTestId("workYearBound1");
      const Year2 = await screen.findByTestId("workYearBound2");
      fireEvent.change(Year1, {
        target: { name: "work_years", value: year.year },
      });
      fireEvent.change(Year2, {
        target: { name: "work_years_boundary", value: year.year2 },
      });
      for (let i = 0; i < 3; i++) {
        fireEvent.click(await screen.findByTestId("btnRight"));
      }
      fireEvent.click(await screen.findByTestId("steps4-submit"));
      const year2 = year?.year2 ?? 0;

      if (
        year.year > 100 ||
        year.year < 0 ||
        year2 > 100 ||
        year2 < 0 ||
        year.year > year2
      ) {
        expect(toast.error).toHaveBeenCalled();
      } else {
        expect(toast.error).not.toHaveBeenCalled();
      }
    }
  });
  const txt = "a";
  const messages = ["", "abc", `${txt.repeat(1000)}`, `${txt.repeat(1001)}`];
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it.each(messages)("Test for message %s", async (message) => {
    vi.spyOn(NotifAPI, "SendNotification");
    const mockUser = {
      age: 40,
      id: "1",
      first_name: "John",
      middle_name: "",
      last_name: "Doe",
      bio_description: "Hi, I’m John",
      degree_type: "Bachelor's degree",
      attended_uni: ["Cambridge University"],
      skills_desc: ["Fill-stack dev"],
      work_years: 3,
    };

    render(<ResultsTable results={[mockUser]} />);

    const messageBtn = screen.getByText(/Send a message!/i);
    fireEvent.click(messageBtn);
    const input = screen.getByTestId("mockLargeInput");
    fireEvent.change(input, { target: { value: message } });
    const sendBtn = screen.getByText(/Send message/i);
    fireEvent.click(sendBtn);

    if (message.length <= 1000) {
      expect(NotifAPI.SendNotification).toHaveBeenCalledWith("1", message);
    } else {
      expect(NotifAPI.SendNotification).not.toHaveBeenCalled();
    }
  });
});
