import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
//Components/Style
import LargeInputForm from "../Profile/components/LargeInpForm.tsx";
import InputForm from "../LoginPg/components/InputForm.tsx";
import DegreeType, {
  SkillsType,
  UniversityInput,
} from "../universal_components/FormTypes.tsx";
import "./Index.css";
//Functions
import { returnBioInfo, updateBioInfo } from "./functions/BioRoutes.tsx";

export function BioFormComponent() {
  const [inputs, setInputs] = useState({
    bio_description: "",
    degree_type: "",
    work_years: null as number | null,
    skills_description: [],
    attended_uni: [],
  });
  useEffect(() => {
    const fetchBioInfo = async () => {
      const bioInfo = await returnBioInfo();
      setInputs((prev) => ({
        ...prev,
        bio_description: bioInfo.bio_description,
        degree_type: bioInfo.degree_type,
        work_years: bioInfo.work_years,
        skills_description: bioInfo.skills_desc,
        attended_uni: bioInfo.attended_uni,
      }));
    };
    fetchBioInfo();
  }, []);
  const handleUpdate = async (e: any) => {
    e.preventDefault();
    const body = {
      bio_description: inputs.bio_description,
      degree_type: inputs.degree_type,
      work_years: inputs.work_years,
      skills_desc: inputs.skills_description,
      attended_uni: inputs.attended_uni,
    };
    const workYears = Number(inputs.work_years ?? 0);
    if (
      (inputs.bio_description ?? "").length > 400 ||
      (workYears ?? 0) > 100 ||
      (workYears ?? 0) < 0
    )
      return;

    const response = await updateBioInfo(body);
    {
      response === "Successfully updated Bio"
        ? toast.success(response)
        : toast.error(response);
    }
  };

  const OnDegreeChange = (degree: any) => {
    setInputs((prev) =>
      prev.degree_type === degree ? prev : { ...prev, degree_type: degree }
    );
  };
  const OnChangeYrs = (e: any) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  const OnSkillsChange = (skills: any) => {
    setInputs((prev) =>
      prev.skills_description === skills
        ? prev
        : { ...prev, skills_description: skills }
    );
  };
  const OnUniChange = (uni: any) => {
    setInputs((prev) =>
      prev.attended_uni === uni ? prev : { ...prev, attended_uni: uni }
    );
  };
  return (
    <form onSubmit={handleUpdate}>
      <div className="form-container-grad">
        <h1 className="headertxt">My Profile</h1>
        <h1 className="titletxt">Education</h1>

        <DegreeType
          defaultValue={inputs.degree_type}
          onChange={OnDegreeChange}
        />
        <h1 className="titletxt">Skills</h1>
        <SkillsType
          defaultValue={inputs.skills_description}
          onChange={OnSkillsChange}
          minHeightItems={4}
        />
        <h1 className="titletxt">Attended UK University</h1>
        <UniversityInput
          onChange={OnUniChange}
          defaultValue={inputs.attended_uni}
          multiSelect={false}
          minHeightItems={5}
        />
        <h1 className="titletxt">Work Years</h1>
        <div className="center">
          <InputForm
            img={null}
            onChange={(e: any) => OnChangeYrs(e)}
            name="work_years"
            value={inputs.work_years}
            type="number"
            placeholder="work years"
            max={100}
            min={0}
            small={true}
            data-testid="workYrs"
          />
        </div>
        <h1 className="titletxt">User Bio</h1>
        <div className="center">
          <LargeInputForm
            onChange={(e: any) => OnChangeYrs(e)}
            name="bio_description"
            value={inputs.bio_description}
            placeholder="Write your profile bio here! Employers will see this! (400 chars max)"
            rows={5}
            cols={10}
            maxTxtSize={400}
            small={true}
            data-testid="userBio"
          />
        </div>
        <div className="submit-container">
          <button className="submit" data-testid="update">
            Update
          </button>
        </div>
      </div>
    </form>
  );
}
