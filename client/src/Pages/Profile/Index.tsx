import React, { useState,useEffect } from "react";
import DashbordBtn from "../Dashboard/components/LinktoPgBtn";
import Dock from "../universal_components/Dock";
import { useNavigate } from "react-router-dom";
import "./Index.css";
import { toast } from "react-toastify";
import dashboardimg from "../universal_components/universal_assets/dashboard.svg";
import { GradForm,EmployerForm } from "./components/FormTypes.tsx";
import { returnGradStatus } from "../../functions/routes.tsx";
export default function Profile() {
  const navigate = useNavigate();
  const [gradStatus,setGradStatus] = useState(false)
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
  console.log(gradStatus)

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
        {gradStatus===true?<GradForm/>:<EmployerForm/>}
      </div>
    </>
  );
}

