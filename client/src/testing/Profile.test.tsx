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

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as api from "../Pages/Profile/components/functions/ProfileRoutes.tsx";
import * as bioApi from "../Pages/Bio/functions/BioRoutes.tsx";
import { MemoryRouter } from "react-router-dom";
import supabase from "../supabase-Client";

import Profile from "../Pages/Profile/Index";
import { BioFormComponent } from "../Pages/Bio/Index.tsx";
import {
  GradForm,
  EmployerForm,
} from "../Pages/Profile/components/FormTypes.tsx";
import * as ProfileRoutes from "../Pages/Profile/components/functions/ProfileRoutes.tsx";

describe("Ensuring everything in the Profile renders properly", () => {
  it("renders graduate profile button when user is a grad", async () => {
    vi.spyOn(ProfileRoutes, "returnGradStatus").mockResolvedValue(true);
    render(
      <MemoryRouter>
        <Profile url={null} />
      </MemoryRouter>
    );
    const GradBtn = await screen.findByTestId("switch-btn");
    expect(GradBtn).toBeInTheDocument();
  });
  it("does not render graduate profile button when user is an employer", async () => {
    vi.spyOn(ProfileRoutes, "returnGradStatus").mockResolvedValue(false);
    render(
      <MemoryRouter>
        <Profile url={null} />
      </MemoryRouter>
    );
    const GradBtn = await screen.queryByTestId("switch-btn");
    expect(GradBtn).not.toBeInTheDocument();
  });
  it("allows switching between profile and bio by clicking on the switch", async () => {
    vi.spyOn(ProfileRoutes, "returnGradStatus").mockResolvedValue(true);
    render(
      <MemoryRouter>
        <Profile url={null} />
      </MemoryRouter>
    );
    const GradBtn = await screen.findByTestId("switch-btn");
    fireEvent.click(GradBtn);
    expect(await screen.findByTestId("Bio")).toBeInTheDocument();
    fireEvent.click(GradBtn);
    //On second click
    expect(await screen.findByTestId("Profile")).toBeInTheDocument();
  });
  it("Displays the correct form when the user is an employer", async () => {
    vi.spyOn(ProfileRoutes, "returnGradStatus").mockResolvedValue(false);
    render(
      <MemoryRouter>
        <Profile url={null} />
      </MemoryRouter>
    );
    expect(await screen.findByTestId("Employer")).toBeInTheDocument();
  });
});
describe("Ensuring everything in the Grad Profile renders properly", () => {
  it("Should render the age, last name, first name, and middle name inputs", async () => {
    render(
      <MemoryRouter>
        <GradForm url={null} />
      </MemoryRouter>
    );
    expect(await screen.findByTestId("FirstName")).toBeInTheDocument();
    expect(await screen.findByTestId("MiddleName")).toBeInTheDocument();
    expect(await screen.findByTestId("LastName")).toBeInTheDocument();
    expect(await screen.findByTestId("Age")).toBeInTheDocument();
    expect(await screen.findByTestId("Image")).toBeInTheDocument();
  });
  const names = [
    "",
    "Bo",
    "Lira",
    "Tovin@@@",
    "Mireya",
    "Calden",
    "Selvanna",
    "Corinthian12356",
    "Velanthor",
    "Ravenliss",
    "Thalorionyx",
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "Seraphindelmarquionasdfdssdffasddsfaasdfdfsdsf",
  ];
  beforeEach(() => {
    global.window = Object.create(global);
    global.window.scrollY = 0;
    global.window.addEventListener = vi.fn();
    global.window.removeEventListener = vi.fn();
  });
  const ages = [
    9,
    16, //boundary
    99,
    100, //boundary
    101, //erroneous
  ];

  it.each(names)("Tests for names %s", async (name) => {
    render(
      <MemoryRouter>
        <GradForm url={null} />
      </MemoryRouter>
    );
    const FirstName = await screen.findByTestId("FirstName");
    const LastName = await screen.findByTestId("LastName");
    const MiddleName = await screen.findByTestId("MiddleName");
    fireEvent.change(FirstName, {
      target: {
        name: "firstname",
        value: name,
      },
    });
    fireEvent.change(LastName, {
      target: {
        name: "lastname",
        value: name,
      },
    });
    fireEvent.change(MiddleName, {
      target: {
        name: "midname",
        value: name,
      },
    });
    const expectedValue = name.slice(0, 30).replace(/[^a-zA-Z]/g, "");
    expect(FirstName.value).toBe(expectedValue);
    expect(LastName.value).toBe(expectedValue);
    expect(MiddleName.value).toBe(expectedValue);
  });
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it.each(ages)("Test for age %s", async (age) => {
    render(
      <MemoryRouter>
        <GradForm url={null} />
      </MemoryRouter>
    );

    const AgeComp = await screen.findByTestId("Age");
    fireEvent.change(AgeComp, { target: { name: "age", value: age } });
    const updateGradInfoSpy = vi.spyOn(api, "updateGradInfo");
    fireEvent.click(await screen.findByTestId("UpdateBtn"));

    if (age < 15 || age > 100) {
      expect(updateGradInfoSpy).not.toHaveBeenCalled();
    } else {
      expect(updateGradInfoSpy).toHaveBeenCalled();
    }
  });

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
    const updateProfileSpy = vi.spyOn(api, "updateProfile");

    render(
      <MemoryRouter>
        <GradForm url={null} />
      </MemoryRouter>
    );
    const fileInput = await screen.findByTestId("Image");

    fireEvent.change(fileInput, {
      target: { files: [file.file] },
    });

    if (file.shouldCall) {
      expect(updateProfileSpy).toHaveBeenCalled();
    } else {
      expect(updateProfileSpy).not.toHaveBeenCalled();
    }
  });
});
describe("Ensuring everything in bio is handled correctly", () => {
  it("Should render all inputs", async () => {
    global.window = Object.create(global);
    global.window.scrollY = 0;
    global.window.addEventListener = vi.fn();
    global.window.removeEventListener = vi.fn();
    render(
      <MemoryRouter>
        <BioFormComponent />
      </MemoryRouter>
    );
    expect(await screen.findByTestId("uniType")).toBeInTheDocument();
    expect(await screen.findByTestId("skillsType")).toBeInTheDocument();
    expect(await screen.findByTestId("degreeType")).toBeInTheDocument();
    expect(await screen.findByTestId("workYrs")).toBeInTheDocument();
    expect(await screen.findByTestId("userBio")).toBeInTheDocument();
  });
  const bioInputs = [
    "",
    "this is a test",
    "helloooooo!",
    "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of de Finibus Bonorum et Malorum (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, Lorem ipsum dolor sit amet.., comes from a line in section 1.10.32. The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from de Finibus Bonorum et Maloru by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });
  it.each(bioInputs)("Handling Bio Inputs", async (bio) => {
    global.window = Object.create(global);
    global.window.scrollY = 0;
    global.window.addEventListener = vi.fn();
    global.window.removeEventListener = vi.fn();
    render(
      <MemoryRouter>
        <BioFormComponent />
      </MemoryRouter>
    );
    const updateBioInfoSpy = vi.spyOn(bioApi, "updateBioInfo");
    const bioComponent = await screen.findByTestId("userBio");
    fireEvent.change(bioComponent, {
      target: {
        name: "bio_description",
        value: bio,
      },
    });
    fireEvent.click(await screen.findByTestId("update"));
    if (bio.length > 400) {
      expect(updateBioInfoSpy).not.toHaveBeenCalled();
    } else {
      expect(updateBioInfoSpy).toHaveBeenCalled();
    }
  });
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const years = [
    -1, //erroneous
    0, //boundary
    20,
    100, //boundary
    101, //erroneous
  ];
  it.each(years)("Test for work year %s", async (year) => {
    render(
      <MemoryRouter>
        <BioFormComponent />
      </MemoryRouter>
    );

    const YearComp = await screen.findByTestId("workYrs");
    fireEvent.change(YearComp, { target: { name: "work_years", value: year } });
    const updateBioInfoSpy = vi.spyOn(bioApi, "updateBioInfo");
    fireEvent.click(await screen.findByTestId("update"));

    if (year > 100 || year < 0) {
      expect(updateBioInfoSpy).not.toHaveBeenCalled();
    } else {
      expect(updateBioInfoSpy).toHaveBeenCalled();
    }
  });
});
describe("Ensuring everything in the Employer Profile renders properly", () => {
  it("Should render the age, last name, first name, and middle name inputs", async () => {
    render(
      <MemoryRouter>
        <EmployerForm url={null} />
      </MemoryRouter>
    );
    expect(await screen.findByTestId("compName")).toBeInTheDocument();
    expect(await screen.findByTestId("compBio")).toBeInTheDocument();
    expect(await screen.findByTestId("Image")).toBeInTheDocument();
    expect(await screen.findByTestId("ImageShow")).toBeInTheDocument();
    expect(await screen.findByTestId("update")).toBeInTheDocument();
  });
  const names = [
    "",
    "Bo",
    "Lira",
    "Tovin@@@",
    "Mireya",
    "Calden",
    "Selvanna",
    "Corinthian12356",
    "Velanthor",
    "Ravenliss",
    "Thalorionyx",
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "Seraphindelmarquionasdfdssdffasddsfaasdfdfsdsf",
    "SeraphindelmarquionasdfdssdffasddsfaasdfdfsdsfSeraphindelmarquionasdfdssdffasddsfaasdfdfsdsSeraphindelmarquionasdfdssdffasddsfaasdfdfsds",
  ];
  beforeEach(() => {
    global.window = Object.create(global);
    global.window.scrollY = 0;
    global.window.addEventListener = vi.fn();
    global.window.removeEventListener = vi.fn();
  });
  it.each(names)("Tests for names %s", async (name) => {
    render(
      <MemoryRouter>
        <EmployerForm url={null} />
      </MemoryRouter>
    );
    const compName = await screen.findByTestId("compName");
    fireEvent.change(compName, {
      target: {
        name: "compname",
        value: name,
      },
    });
    const expectedValue = name.slice(0, 50);
    expect(compName.value).toBe(expectedValue);
  });
  const txt = "hi";
  const bios = [
    "",
    "Heyo",
    `${txt.repeat(1000)}`, //erroneous
    `${txt.repeat(500)}`, //boundary
    `${txt.repeat(200)}`,
  ];
  it.each(bios)("Test for employer's bio", async (bio) => {
    render(
      <MemoryRouter>
        <EmployerForm url={null} />
      </MemoryRouter>
    );
    const compBio = await screen.findByTestId("compBio");
    fireEvent.change(compBio, {
      target: {
        name: "bio",
        value: bio,
      },
    });
    const expectedValue = bio.slice(0, 1000);
    expect(compBio.value).toBe(expectedValue);
  });
});
