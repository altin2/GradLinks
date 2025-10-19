import React from "react";
import { useState, useEffect } from "react";
import "./FormTypeStyle.css";
import searchIcon from "../universal_components/universal_assets/searchTalent.svg";
import plusIcon from "../universal_components/universal_assets/plusicon.svg";
import minusicon from "../universal_components/universal_assets/minusicon.svg";
import supabase from "../../supabase-Client";
export const defaultskills = [
  "Full-stack developer",
  "Frontend developer",
  "Backend developer",
  "DevOps engineer",
  "Database administrator",
  "Software engineer",
  "System administrator",
  "Network administrator",
  "Security analyst",
  "System analyst",
  "Software tester",
  "Software architect",
  "Software developer",
  "Mobile developer",
  "UI/UX designer",
  "Graphic designer",
  "Content writer",
  "Content editor",
  "Content strategist",
];
interface UniProp {
  UKPRN: number;
  PROVIDER_NAME: string;
  VIEW_NAME: string;
}
interface DegreeProp {
  defaultValue: any;
  onChange: any;
}
interface SkillProp {
  defaultValue?: string[];
  onChange?: (skills: string[]) => void;
  minHeightItems?: number;
}
interface UniComponentProp {
  defaultValue?: string[];
  onChange?: (uni: string[]) => void;
  multiSelect?: boolean;
  minHeightItems?: number;
  classNameForm?: string;
}
export const Universities = await ImportUniversities();

async function ImportUniversities(): Promise<UniProp[]> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const res = await fetch("http://localhost:5000/search/returnunis", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token}`,
    },
  });

  const parseRes: Promise<UniProp[]> = await res.json();
  return parseRes;
}

export default function DegreeType({ defaultValue, onChange }: DegreeProp) {
  //syncing defaultValue
  const [selected, setSelected] = useState(defaultValue ?? "");
  useEffect(() => {
    if (defaultValue && defaultValue.length > 0 && selected.length === 0) {
      setSelected(defaultValue);
    }
  }, [defaultValue]);
  const handleChange = (e: any) => {
    setSelected(e.target.value);
    if (onChange) onChange(e.target.value);
  };
  return (
    <>
      <fieldset data-testid="degreeType">
        <select
          className="form-control dropdown"
          id="education"
          name="education"
          value={defaultValue}
          onChange={handleChange}
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
}

export function SkillsType({
  defaultValue = [],
  onChange,
  minHeightItems,
}: SkillProp) {
  const [selected, setSelected] = useState(defaultValue ?? []);
  const [isDropped, setIsDropped] = useState(false);

  //syncing defaultValue
  useEffect(() => {
    if (defaultValue && defaultValue.length > 0 && selected.length === 0) {
      setSelected(defaultValue);
    }
  }, [defaultValue]);

  //Checks if the inputs in the form have been changed
  useEffect(() => {
    if (onChange) {
      onChange(selected);
    }
  }, [selected, onChange]);

  const onClickDropdown = () => {
    setIsDropped(!isDropped);
  };

  // toggles a skill on click
  const toggleSkill = (skill: string) => {
    setSelected(
      (prev) =>
        prev.includes(skill)
          ? prev.filter((s) => s !== skill) // remove if already selected
          : [...prev, skill] // add if not selected
    );
  };

  return (
    <>
      <div data-testid="skillsType">
        <button
          type="button"
          onClick={onClickDropdown}
          className="form-control dropdown gray"
        >
          {isDropped
            ? "---Click to hide skills---"
            : "---Click to show skills---"}
        </button>
      </div>
      {isDropped ? (
        <fieldset>
          <div
            className="vertical-scroll"
            style={{ minHeight: minHeightItems * 42 || "300px" }}
          >
            {defaultskills.map((skill, idx) => (
              <>
                <div className="side-by-side">
                  <img
                    src={selected.includes(skill) ? minusicon : plusIcon}
                    alt="Add skill"
                    onClick={() => toggleSkill(skill)}
                    className="multiselect-img-container"
                    style={{ cursor: "pointer" }}
                    data-testid={`imgSelect-${idx}`}
                  />
                  <div
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={
                      selected.includes(skill)
                        ? "inputSelect_selected"
                        : "inputSelect"
                    }
                  >
                    {skill}
                  </div>
                </div>
              </>
            ))}
          </div>
        </fieldset>
      ) : (
        <></>
      )}
    </>
  );
}

export function UniversityInput({
  defaultValue = [],
  onChange,
  multiSelect = false,
  minHeightItems,
  classNameForm,
}: UniComponentProp) {
  const [selected, setSelected] = useState(defaultValue ?? []);
  const [search, setSearch] = useState("");
  //syncing defaultValue
  useEffect(() => {
    if (defaultValue && defaultValue.length > 0 && selected.length === 0) {
      setSelected(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    if (onChange) {
      onChange(selected);
    }
  }, [selected, onChange]);

  // toggles a university on click
  const toggleUni = (uni: any) => {
    {
      multiSelect === true
        ? setSelected(
            (prev) =>
              prev.includes(uni)
                ? prev.filter((s) => s !== uni) // remove if already selected
                : [...prev, uni] // add if not selected
          )
        : setSelected(
            (prev) =>
              prev.includes(uni)
                ? prev.filter((s) => s !== uni) // remove previously selected value
                : [uni] // add if not selected
          );
    }
  };
  const filteredUnis = Universities.filter((uni) =>
    uni.VIEW_NAME.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <>
      <div className="side-by-side" data-testid="uniType">
        <img src={searchIcon} className="search-img-container" />
        <input
          type="text"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          className="search_bar"
        />
      </div>
      <fieldset className={classNameForm ? classNameForm : ""}>
        <div
          className="vertical-scroll"
          style={{ minHeight: minHeightItems * 42 || "300px" }}
        >
          {filteredUnis.map((uni) => (
            <>
              <div
                key={uni.UKPRN}
                onClick={() => toggleUni(uni.VIEW_NAME)}
                className={`inputSelect${
                  selected.includes(uni.VIEW_NAME) ? "_selected" : ""
                }`}
              >
                {uni.VIEW_NAME}
              </div>
            </>
          ))}
        </div>
      </fieldset>
    </>
  );
}
