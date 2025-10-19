vi.mock("../supabase-Client.js", () => ({
  __esModule: true,
  default: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: {
          session: {
            user: { user_metadata: { isGrad: true } },
            access_token: "token123",
          },
        },
        error: null,
      }),
    },
  },
}));
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
import { NoticeBoardGrad } from "../Pages/Dashboard/components/NoticeBoardGraduate";
import { NoticeBoardEmployer } from "../Pages/Dashboard/components/NoticeBoardEmployer";
import * as noticeBoardAPI from "../Pages/Dashboard/components/functions/NoticeBoardFunctions";

const mockGrad = () => {
  (supabase.auth.getSession as vi.Mock).mockResolvedValue({
    data: {
      session: {
        user: {
          user_metadata: {
            isGrad: true,
            email: "altin.mackinnon@gmail.com",
            email_verified: true,
          },
          id: "1090cf12-3912-48b3-a12e-201146375534",
        },
        access_token: "token123",
      },
    },
    error: null,
  });
  render(
    <MemoryRouter>
      <NoticeBoardGrad />
    </MemoryRouter>
  );
};
const mockEmployer = () => {
  (supabase.auth.getSession as vi.Mock).mockResolvedValue({
    data: {
      session: {
        user: {
          user_metadata: {
            isGrad: false,
            email: "ctrlaltdltgames@gmail.com",
            email_verified: true,
          },
          id: "e49b761f-f2f7-4c06-ae49-5a9d2890c4a6",
        },
        access_token: "token123",
      },
    },
    error: null,
  });
  render(
    <MemoryRouter>
      <NoticeBoardEmployer />
    </MemoryRouter>
  );
};

describe("Ensuring everything renders properly", () => {
  it("Should render relevant notices if the user is a graduate", async () => {
    vi.spyOn(noticeBoardAPI, "RetrieveRelevantNotices").mockResolvedValue([]);
    mockGrad();

    await waitFor(() => {
      expect(noticeBoardAPI.RetrieveRelevantNotices).toHaveBeenCalled();
    });
  });
  it("Should render random notices if the user is an employer", async () => {
    vi.spyOn(noticeBoardAPI, "RetrieveRandomNotices").mockResolvedValue([]);
    mockEmployer();
    await waitFor(() => {
      expect(noticeBoardAPI.RetrieveRandomNotices).toHaveBeenCalled();
    });
  });
  it("When the employer clicks on the filter button, it should render personal notices.", async () => {
    vi.spyOn(noticeBoardAPI, "RetrievePersonalNotices").mockResolvedValue([]);
    mockEmployer();
    fireEvent.click(await screen.getByTestId("filterBtn"));
    await waitFor(() => {
      expect(noticeBoardAPI.RetrievePersonalNotices).toHaveBeenCalled();
    });
  });
  it("When the employer clicks on the post button, the modal for posting is rendered.", async () => {
    mockEmployer();
    fireEvent.click(await screen.findByTestId("postBtn"));
    expect(await screen.findByTestId("postModal")).toBeInTheDocument();
  });
});
describe("All the modal tests are done here", () => {
  const files = [
    {
      file: new File(["dummy"], "avatar.jpg", { type: "image/jpeg" }),
      shouldCall: true,
      type: "JPEG",
    },
    {
      file: new File(["hello"], "notes.txt", { type: "text/plain" }),
      shouldCall: false,
      type: "TXT",
    },
    {
      file: new File(["dummy"], "resume.pdf", { type: "application/pdf" }),
      shouldCall: false,
      type: "PDF",
    },
    {
      file: new File(["dummy"], "photo.png", { type: "image/png" }),
      shouldCall: true,
      type: "PNG",
    },
  ];
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it.each(files)("handling $type correctly", async (file) => {
    mockEmployer();
    fireEvent.click(await screen.findByTestId("postBtn"));
    vi.spyOn(noticeBoardAPI, "PostNotice");

    const fileInput = await screen.findByTestId("Image");

    fireEvent.change(fileInput, {
      target: { files: [file.file] },
    });
    fireEvent.change(await screen.findByTestId("title"), {
      target: {
        name: "title",
        value: "Heyo",
      },
    });
    fireEvent.click(
      await screen.findByRole("button", { name: /Post Notice/i })
    );

    if (file.shouldCall) {
      expect(await noticeBoardAPI.PostNotice).toHaveBeenCalled();
      expect(await toast.success).toHaveBeenCalled();
    } else {
      expect(await noticeBoardAPI.PostNotice).not.toHaveBeenCalled();
      expect(await toast.error).toHaveBeenCalled();
    }
  });
  const titles = [
    "",
    "a",
    "asdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdf",
    "asdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgasdfgg",
  ];
  it.each(titles)("handling title: %s correctly", async (title) => {
    mockEmployer();
    fireEvent.click(await screen.findByTestId("postBtn"));
    vi.spyOn(noticeBoardAPI, "PostNotice");
    fireEvent.change(await screen.findByTestId("title"), {
      target: {
        name: "title",
        value: title,
      },
    });
    fireEvent.click(
      await screen.findByRole("button", { name: /Post Notice/i })
    );
    if (title.length > 0 && title.length <= 50) {
      expect(await noticeBoardAPI.PostNotice).toHaveBeenCalled();
      expect(await toast.success).toHaveBeenCalled();
    } else {
      expect(await noticeBoardAPI.PostNotice).not.toHaveBeenCalled();
    }
  });
  const txt = "a";
  const bios = ["", "abc", `${txt.repeat(1000)}`, `${txt.repeat(1001)}`];
  it.each(bios)("handling bio: %s correctly", async (bio) => {
    mockEmployer();
    fireEvent.click(await screen.findByTestId("postBtn"));
    vi.spyOn(noticeBoardAPI, "PostNotice");
    fireEvent.change(await screen.findByTestId("title"), {
      target: {
        name: "title",
        value: "123",
      },
    });
    fireEvent.change(await screen.findByTestId("Description"), {
      target: {
        name: "message",
        value: bio,
      },
    });
    fireEvent.click(
      await screen.findByRole("button", { name: /Post Notice/i })
    );
    if (bio.length <= 1000) {
      expect(await noticeBoardAPI.PostNotice).toHaveBeenCalled();
      expect(await toast.success).toHaveBeenCalled();
    } else {
      expect(await noticeBoardAPI.PostNotice).not.toHaveBeenCalled();
    }
  });
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
    mockEmployer();
    fireEvent.click(await screen.findByTestId("postBtn"));
    vi.spyOn(noticeBoardAPI, "PostNotice");

    fireEvent.change(await screen.findByTestId("title"), {
      target: {
        name: "title",
        value: "123",
      },
    });
    const Select = await screen.findByTestId("YearSign");
    fireEvent.change(Select, { target: { name: "sign", value: year.sign } });
    if (year.sign !== "<>") {
      const YearComp = await screen.findByTestId("workYear");
      screen.debug();
      fireEvent.change(YearComp, {
        target: { name: "work_years", value: year.year },
      });
      fireEvent.click(await screen.findByTestId("postNoticeBtn"));
      if (year.year > 100 || year.year < 0) {
        expect(noticeBoardAPI.PostNotice).not.toHaveBeenCalled();
      } else {
        expect(noticeBoardAPI.PostNotice).toHaveBeenCalled();
      }
    } else {
      const Year1 = await screen.findByTestId("workYearBound1");
      const Year2 = await screen.findByTestId("workYearBound2");
      fireEvent.change(Year1, {
        target: { name: "work_years", value: year.year },
      });
      fireEvent.change(Year2, {
        target: { name: "work_years_boundary", value: year.year2 },
      });
      fireEvent.click(await screen.findByTestId("postNoticeBtn"));
      const year2 = year?.year2 ?? 0;

      if (
        year.year > 100 ||
        year.year < 0 ||
        year2 > 100 ||
        year2 < 0 ||
        year.year > year2
      ) {
        expect(noticeBoardAPI.PostNotice).not.toHaveBeenCalled();
      } else {
        expect(noticeBoardAPI.PostNotice).toHaveBeenCalled();
      }
    }
  });
  const dates = [
    new Date().toISOString().split("T")[0], //boundary
    "1999-01-01", //invalid
    "2025-12-12", //valid
  ];
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it.each(dates)("Test for date %s", async (date) => {
    mockEmployer();
    fireEvent.click(await screen.findByTestId("postBtn"));

    const postNoticeSpy = vi.spyOn(noticeBoardAPI, "PostNotice");
    fireEvent.change(await screen.findByTestId("title"), {
      target: {
        name: "title",
        value: "123",
      },
    });
    const dateInput = await screen.findByTestId("dateInput");
    const today = new Date().toISOString().split("T")[0];

    fireEvent.change(dateInput, { target: { value: date } });
    fireEvent.click(
      await screen.findByRole("button", { name: /Post Notice/i })
    );
    if (new Date(date) >= new Date(today)) {
      expect(postNoticeSpy).toHaveBeenCalled();
    } else {
      expect(postNoticeSpy).not.toHaveBeenCalled();
    }
  });
});
