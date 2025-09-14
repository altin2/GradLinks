import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
//Components
import InputForm from "../../LoginPg/components/InputForm";
import { SkillsType } from "../../universal_components/FormTypes";
import { UniversityInput } from "../../universal_components/FormTypes";
//functions
import { RelevanceAlgorithm } from "./functions/RelevanceAlgorithm";

export function SearchAlgoInputForm({ onChange }) {
  const [isSubmit, setIsSubmit] = useState<Boolean>(false);
  const degrees: string[] = [
    "No formal education",
    "Primary education",
    "Secondary education",
    "GED",
    "Vocational qualification",
    "Bachelor's degree",
    "Master's degree",
    "Doctorate or higher",
  ];
  const [response, setResponse] = useState([]);
  const [inputs, setInputs] = useState({
    degree_type: "",
    work_years: 0,
    work_years_boundary: 0,
    skills_description: [],
    uni_names: [],
  });
  useEffect(() => {
    if (onChange && response !== null) {
      onChange(response);
    }
  }, [response]);
  const [selectedSign, setSelectedSign] = useState(">");
  const OnChangeForm = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };
  const OnChangeFormSkills = (skills) => {
    setInputs((prev) =>
      prev.skills_description === skills
        ? prev
        : { ...prev, skills_description: skills }
    );
  };
  const OnChangeFormUni = (uni) => {
    setInputs((prev) =>
      prev.uni_names === uni ? prev : { ...prev, uni_names: uni }
    );
  };
  const OnChangeSign = (e) => {
    setSelectedSign(e.target.value);
  };
  const OnSubmitTalentForm = async (e) => {
    e.preventDefault();
    const DegreeParams = degrees.slice(degrees.indexOf(inputs.degree_type));
    const SkillParams = inputs.skills_description;
    const UniParams = inputs.uni_names;
    var WorkParams = "";
    if (selectedSign === "<>") {
      WorkParams = `${inputs.work_years} ${selectedSign} ${inputs.work_years_boundary}`;
    } else {
      WorkParams = `${selectedSign} ${inputs.work_years} `;
    }
    if (
      !(
        selectedSign === "<>" && inputs.work_years_boundary < inputs.work_years
      ) &&
      selectedSign !== "" &&
      inputs.degree_type !== "" &&
      inputs.skills_description.length > 0
    ) {
      const res = await RelevanceAlgorithm(
        WorkParams,
        SkillParams,
        DegreeParams,
        UniParams
      );
      setResponse(res);
      setIsSubmit(true);
    } else {
      toast.error("There was an error in your inputs");
    }
  };

  return (
    <>
      {isSubmit === false ? (
        <form onSubmit={OnSubmitTalentForm} className="form-container">
          <h1 className="titletxt">Minimum Degree type</h1>
          <fieldset>
            <select
              className="form-control dropdown"
              id="education"
              name="degree_type"
              value={inputs.degree_type}
              onChange={OnChangeForm}
            >
              <option value="" disabled={true}>
                -- select one --
              </option>
              <option value="No formal education">No formal education</option>
              <option value="Primary education">Primary education</option>
              <option value="Secondary education">
                Secondary education or high school
              </option>
              <option value="GED">GED</option>
              <option value="Vocational qualification">
                Vocational qualification
              </option>
              <option value="Bachelor's degree">Bachelor's degree</option>
              <option value="Master's degree">Master's degree</option>
              <option value="Doctorate or higher">Doctorate or higher</option>
            </select>
          </fieldset>
          <h1 className="titletxt">Work Years</h1>
          <fieldset>
            <select
              className="form-control dropdown"
              id="sign"
              name="sign"
              onChange={OnChangeSign}
            >
              <option value="" disabled={true}>
                -- select one --
              </option>
              <option value=">">Greater than</option>
              <option value=">=">Greater than or equal to</option>
              <option value="<">Less than</option>
              <option value="<=">Less than or equal to</option>
              <option value="<>">Between </option>
            </select>
          </fieldset>
          {selectedSign === "<>" ? (
            <>
              <InputForm
                img={null}
                onChange={OnChangeForm}
                name="work_years"
                value={inputs.work_years}
                type="number"
                placeholder="First Value"
              />
              <InputForm
                img={null}
                onChange={OnChangeForm}
                name="work_years_boundary"
                value={inputs.work_years_boundary}
                type="number"
                placeholder="Second Value"
              />
            </>
          ) : (
            <InputForm
              img={null}
              onChange={OnChangeForm}
              name="work_years"
              value={inputs.work_years}
              type="number"
              placeholder="Enter here"
            />
          )}

          <h1 className="titletxt">Skills</h1>
          <SkillsType
            defaultValue={inputs.skills_description}
            onChange={OnChangeFormSkills}
          />
          <h1 className="titletxt">Universities</h1>
          <UniversityInput onChange={OnChangeFormUni} />
          <div className="submit-container">
            <button className="submit">Submit the form</button>
          </div>
        </form>
      ) : (
        <div className="formcontainer">
          <h1 className="titletxt">Loading...</h1>
        </div>
      )}
    </>
  );
}
