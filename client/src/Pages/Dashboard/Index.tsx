
//Package features and stuff
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
//Components
import TextType from "./components/TextType.js";
import DashbordBtn from "./components/LinktoPgBtn.js";
import Dock from "../universal_components/Dock.js";
//Assets
import emptypfp from "../universal_components/universal_assets/emptypfp.svg";
import logoutimg from "../universal_components/universal_assets/logout.svg";
import notifempty from "../universal_components/universal_assets/notification.svg"
import notifcontains from "../universal_components/universal_assets/notificationFull.svg"

//Styles and routes
import "./Index.css";
import { getProfile,logout } from "../../functions/routes.tsx";
import { ReturnUserNotifs } from "../Notifications/components/functions/NotificationRoutes.tsx";


const Dashboard = ({ setAuth }) => {
  
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [notifLen,setNotifLen]= useState(null)
  const items = [
    {
      icon: <DashbordBtn size={50} img_path={logoutimg} />,
      label: "Logout",
      onClick: ()=>logout(),
    },
    {
      icon: <DashbordBtn size={50} img_path={emptypfp} />,
      label: "Profile",
      onClick: () => navigate("/profile"),
    },
    { icon: <DashbordBtn  size={60} img_path={notifLen>0||notifLen!== null?notifcontains:notifempty}/>, label: `${notifLen} unread ${notifLen>1?"notifications":"notification"} `, onClick: () => navigate("/notifications") },
    // { icon: <LinktoPgBtn  size={70}/>, label: 'Settings', onClick: () => alert('Settings!') },
  ];
  useEffect(() => {
    const fetchProfile = async () => {
      const profileName = await getProfile();
      const notifs = await ReturnUserNotifs();
      setNotifLen(notifs.length)
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
