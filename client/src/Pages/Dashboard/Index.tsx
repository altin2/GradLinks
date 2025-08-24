import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import TextType from "./components/TextType.js";
import DashbordBtn from "./components/LinktoPgBtn.js";
import emptypfp from "../universal_components/universal_assets/emptypfp.svg";
import logoutimg from "../universal_components/universal_assets/logout.svg";
import Dock from "../universal_components/Dock.js";
import "./Index.css";
import { getProfile,logout } from "../../functions/routes.tsx";
const Dashboard = ({ setAuth }) => {
  
  const naviagate = useNavigate();
  const [name, setName] = useState("");
  const items = [
    {
      icon: <DashbordBtn size={50} img_path={logoutimg} />,
      label: "Logout",
      onClick: ()=>logout(),
    },
    {
      icon: <DashbordBtn size={50} img_path={emptypfp} />,
      label: "Profile",
      onClick: () => naviagate("/profile"),
    },
    // { icon: <LinktoPgBtn  size={60}/>, label: 'Profile', onClick: () => alert('Profile!') },
    // { icon: <LinktoPgBtn  size={70}/>, label: 'Settings', onClick: () => alert('Settings!') },
  ];
  useEffect(() => {
    const fetchProfile = async () => {
      const profileName = await getProfile();
      setName(profileName);
    };
    fetchProfile();
  }, [])


  return (
    <div className="top-bar">
      <div>
        <TextType
          text={[`Welcome ${name}`]}
          typingSpeed={75}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="|"
        />
        <Dock
          items={items}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
      </div>
    </div>
  );
};

export default Dashboard;
