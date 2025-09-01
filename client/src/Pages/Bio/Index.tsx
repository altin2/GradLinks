import React, { useState,useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

//Assets
import dashboardimg from "../universal_components/universal_assets/dashboard.svg";

//Components/Style
import DegreeType,{SkillsType} from "../universal_components/FormTypes.tsx";
import DashbordBtn from "../Dashboard/components/LinktoPgBtn";
import Dock from "../universal_components/Dock";
import "./Index.css";
//Functions
import { returnBioInfo,updateBioInfo } from "./functions/BioRoutes.tsx";


export default function Bio() {
    const navigate = useNavigate();
    const items = [
        {
          icon: <DashbordBtn size={50} img_path={dashboardimg} />,
          label: "Back To Dashboard",
          onClick: () => navigate("/dashboard"),
        },
              {
                icon: <DashbordBtn size={50} img_path={null} />,
                label: "Back to Profile",
                onClick: () => navigate("/profile"),
              },
      ];
      const [inputs, setInputs] = useState({
        bio_description: "",
        degree_type: "",
        work_years: null as number|null,
        skills_description:[]
      });
      useEffect(() => {
        const fetchBioInfo = async () => {
          const bioInfo = await returnBioInfo();
          setInputs(prev => ({
            ...prev,
            bio_description:bioInfo.bio_description,
            degree_type:bioInfo.degree_type,
            work_years:bioInfo.work_years,
            skills_description:bioInfo.skills_desc
          }))
        };
        fetchBioInfo();
      }, []);
      const handleUpdate = async (e) => {
        e.preventDefault();
        const body = {bio_description:inputs.bio_description,
          degree_type:inputs.degree_type,
          work_years:inputs.work_years,
          skills_desc:inputs.skills_description}
        
        const response = await updateBioInfo(body)
        {response==="Success"?toast.success(response):toast.error(response)}
      };
    const OnSkillsChange =(skills)=>{
      setInputs((prev) =>prev.skills_description === skills ? prev : { ...prev, skills_description: skills })
    }
  return (
    <>
      <div className="top-bar">
        <Dock
          items={items}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
      </div>
      <form onSubmit={handleUpdate}>
      <div className="form-container">
      <h1 className="titletxt">Education</h1>
      <DegreeType 
      defaultValue={inputs.degree_type} 
      />
      <h1 className="titletxt">Skills</h1>
      <SkillsType
  defaultValue={inputs.skills_description}
  onChange={OnSkillsChange}
/>
<div className="submit-container">
              <button className="submit">Update</button>
            </div>
      </div>
      </form>
    </>
  );
}

