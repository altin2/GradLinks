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
  const handleUpdate = async (e) => {
    e.preventDefault();
    const body = {
      bio_description: inputs.bio_description,
      degree_type: inputs.degree_type,
      work_years: inputs.work_years,
      skills_desc: inputs.skills_description,
      attended_uni: inputs.attended_uni,
    };

    const response = await updateBioInfo(body);
    {
      response === "Success" ? toast.success(response) : toast.error(response);
    }
  };

  const OnDegreeChange = (degree) => {
    setInputs((prev) =>
      prev.degree_type === degree ? prev : { ...prev, degree_type: degree }
    );
  };
  const OnChangeYrs = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  const OnSkillsChange = (skills) => {
    setInputs((prev) =>
      prev.skills_description === skills
        ? prev
        : { ...prev, skills_description: skills }
    );
  };
  const OnUniChange = (uni) => {
    setInputs((prev) =>
      prev.attended_uni === uni ? prev : { ...prev, attended_uni: uni }
    );
  };
  return (
    <form onSubmit={handleUpdate}>
      <div className="form-container">
        <h1 className="headertxt">Employers can see this!</h1>
        <h1 className="titletxt">Education</h1>
        <DegreeType
          defaultValue={inputs.degree_type}
          onChange={OnDegreeChange}
        />
        <h1 className="titletxt">Skills</h1>
        <SkillsType
          defaultValue={inputs.skills_description}
          onChange={OnSkillsChange}
        />
        <h1 className="titletxt">Attended University</h1>
        <UniversityInput
          onChange={OnUniChange}
          defaultValue={inputs.attended_uni}
          multiSelect={false}
        />
        <h1 className="titletxt">Work Years</h1>
        <InputForm
          img={null}
          onChange={(e) => OnChangeYrs(e)}
          name="work_years"
          value={inputs.work_years}
          type="number"
          placeholder="work years"
        />
        <h1 className="titletxt">User Bio</h1>
        <LargeInputForm
          onChange={(e) => OnChangeYrs(e)}
          name="bio_description"
          value={inputs.bio_description}
          placeholder="Write your profile bio here! Employers will see this! (400 chars max)"
          rows={5}
          cols={10}
          maxTxtSize={400}
        />
        <div className="submit-container">
          <button className="submit">Update</button>
        </div>
      </div>
    </form>
  );
}
