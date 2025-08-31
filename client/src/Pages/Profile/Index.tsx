import React, { useState,useEffect } from "react";

import { useNavigate } from "react-router-dom";

//Assets
import dashboardimg from "../universal_components/universal_assets/dashboard.svg";

//Components/Styles
import { GradForm,EmployerForm } from "./components/FormTypes.tsx";
import DashbordBtn from "../Dashboard/components/LinktoPgBtn";
import Dock from "../universal_components/Dock";
import "./Index.css";
//Functions
import { returnGradStatus} from "./components/functions/ProfileRoutes.tsx";
export default function Profile() {
  const navigate = useNavigate();
  const [gradStatus,setGradStatus] = useState(null)
  const items = [
    {
      icon: <DashbordBtn size={50} img_path={dashboardimg} />,
      label: "Back To Dashboard",
      onClick: () => navigate("/dashboard"),
    },
  ];
  useEffect(() => {
    const fetchGradStatus = async () => {
      const profileName = await returnGradStatus();
      setGradStatus(profileName);
    };
    fetchGradStatus();
  }, [])
  
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
      <div className="form-container">
      {gradStatus === null 
        ? <h1 className="titletxt">Loading...</h1>
        : gradStatus === true 
          ? <GradForm/> 
          : <EmployerForm/>}
      </div>
    </>
  );
}

