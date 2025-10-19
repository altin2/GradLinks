import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
//Components
import InputForm from "../../LoginPg/components/InputForm";
import { SkillsType } from "../../universal_components/FormTypes";
import { UniversityInput } from "../../universal_components/FormTypes";
//functions
import { RelevanceAlgorithm } from "./functions/RelevanceAlgorithm";

export function SearchAlgoInputForm({ onChange }: any) {
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
    if (onChange && response !== null && response.length > 0) {
      onChange(response);
    }
  }, [response]);

  const [selectedSign, setSelectedSign] = useState(">");
  const OnChangeForm = (e: any) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };
  const OnChangeFormSkills = (skills: any) => {
    setInputs((prev) =>
      prev.skills_description === skills
        ? prev
        : { ...prev, skills_description: skills }
    );
  };
  const OnChangeFormUni = (uni: any) => {
    setInputs((prev) =>
      prev.uni_names === uni ? prev : { ...prev, uni_names: uni }
    );
  };
  const OnChangeSign = (e: any) => {
    setSelectedSign(e.target.value);
  };

  const Skills = (id: string) => {
    return (
      <>
        <div className="mid-container" data-testid={id}>
          <SkillsType
            defaultValue={inputs.skills_description}
            onChange={OnChangeFormSkills}
          />
        </div>
      </>
    );
  };
  const WorkYrs = (id: string) => {
    return (
      <>
        <fieldset className="mid-container" data-testid={id}>
          <select
            className="form-control dropdown"
            id="sign"
            name="sign"
            onChange={OnChangeSign}
            data-testid={`Select-${id}`}
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
              data-testid="workYearBound1"
              min={0}
              max={100}
            />
            <InputForm
              img={null}
              onChange={OnChangeForm}
              name="work_years_boundary"
              value={inputs.work_years_boundary}
              type="number"
              placeholder="Second Value"
              data-testid="workYearBound2"
              min={0}
              max={100}
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
            data-testid="workYear"
            min={0}
            max={100}
          />
        )}
      </>
    );
  };
  const DegreeType = (id: string) => {
    return (
      <>
        <fieldset className="mid-container" data-testid={id}>
          <select
            className="form-control dropdown"
            id="education"
            name="degree_type"
            value={inputs.degree_type}
            onChange={OnChangeForm}
            data-testid={`Select-${id}`}
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
      </>
    );
  };
  const Unis = (id: string) => {
    return (
      <>
        <div data-testid={id}>
          <UniversityInput onChange={OnChangeFormUni} multiSelect={true} />
        </div>
      </>
    );
  };
  const Submit = (id: string) => {
    return (
      <>
        <div className="submit-container" data-testid={id}>
          <button type="submit" className="submit" data-testid={`${id}-submit`}>
            Submit the form
          </button>
        </div>
      </>
    );
  };
  const steps = [
    {
      title:
        "First, Let's fill out what the minimum degree you want in your graduates",
      comp: DegreeType("steps0"),
    },
    {
      title: "Next, how much work experience they should have beforehand",
      comp: WorkYrs("steps1"),
    },
    {
      title: "What skills should they have? Choose at least one",
      comp: Skills("steps2"),
    },
    {
      title: "Where should they have graduated from? (Optional)",
      comp: Unis("steps3"),
    },
    { title: "All done! Let's submit", comp: Submit("steps4") },
  ];
  const [index, setIndex] = useState(0);
  const NextPage = () => {
    setIndex(index + 1);
  };
  const PrevPage = () => {
    setIndex(index - 1);
  };
  const OnSubmitTalentForm = async (e: any) => {
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
    if (inputs.work_years < 0 || inputs.work_years > 100) {
      toast.error("Check you work years input, it is not valid");
    } else if (
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
      toast.error("You did not fill in all the required fields");
    }
  };

  return (
    <>
      {isSubmit === false ? (
        <>
          <form onSubmit={OnSubmitTalentForm} className="form-container-talent">
            <h1 className="titletxt">{steps[index].title}</h1>

            {steps[index].comp}

            <input
              type="button"
              onClick={PrevPage}
              placeholder="Previous"
              disabled={index === 0}
              className="button-arrow-left"
              data-testid="btnLeft"
            />
            <input
              type="button"
              onClick={NextPage}
              placeholder={"Next"}
              disabled={index === steps.length - 1}
              className="button-arrow-right"
              data-testid="btnRight"
            />
          </form>
        </>
      ) : (
        <div className="formcontainer">
          <h1 className="titletxt">Loading...</h1>
        </div>
      )}
    </>
  );
}
