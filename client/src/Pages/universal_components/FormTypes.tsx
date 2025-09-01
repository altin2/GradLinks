import React from "react";
import { useState,useEffect } from "react";
import "./FormTypeStyle.css"
export default function DegreeType({defaultValue}){
    
    return(
        <>
        <fieldset>
  <select class="form-control dropdown" id="education" name="education">
    <option value="" selected={defaultValue===""||defaultValue===null?"selected":""} disabled="disabled">-- select one --</option>
    <option value="No formal education"selected={defaultValue==="No formal education"?"selected":""}>No formal education</option>
    <option value="Primary education"selected={defaultValue==="Primary education"?"selected":""}>Primary education</option>
    <option value="Secondary education"selected={defaultValue==="Secondary education"?"selected":""}>Secondary education or high school</option>
    <option value="GED"selected={defaultValue==="GED"?"selected":""}>GED</option>
    <option value="Vocational qualification"selected={defaultValue==="Vocational qualification"?"selected":""}>Vocational qualification</option>
    <option value="Bachelor's degree"selected={defaultValue==="Bachelor's degree"?"selected":""}>Bachelor's degree</option>
    <option value="Master's degree"selected={defaultValue==="Master's degree"?"selected":""}>Master's degree</option>
    <option value="Doctorate or higher"selected={defaultValue==="Doctorate or higher"?"selected":""}>Doctorate or higher</option>
  </select>
</fieldset>
        </>
    )
}


export function SkillsType({defaultValue=[],onChange,}: {defaultValue?: string[];onChange?: (skills: string[]) => void;}){
    const [selected, setSelected] = useState(defaultValue ?? []);
    const [isDropped,setIsDropped] = useState(false)
  const defaultskills = [
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

  
  const onClickDropdown= ()=>{
    setIsDropped(!isDropped)
  }

  // toggles a skill on click
  const toggleSkill = (skill: string) => {
    setSelected((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill) // remove if already selected
        : [...prev, skill] // add if not selected
    );
  };

  return (
    <>
    <div ><button onClick={onClickDropdown} className="form-control dropdown">---Click to show skills---</button></div>
    {isDropped?
    <fieldset>
        <div className="vertical-scroll">
        {defaultskills.map((skill) => (
          <div
            key={skill}
            onClick={() => toggleSkill(skill)}
            style={{
              cursor: "pointer",
              padding: "6px 10px",
              margin: "2px 0",
              borderRadius: "4px",
              border: "1px solid #ccc",
              background: selected.includes(skill) ? "#007bff" : "white",
              color: selected.includes(skill) ? "white" : "black",
            }}
          >
            {skill}
          </div>
        ))}
      </div>
    </fieldset>
    
    :
    <></>
}
    </>
  );
}
