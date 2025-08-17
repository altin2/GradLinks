
import React, { useEffect, useState,useCallback} from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import TextType from './components/TextType.js';
import DashbordBtn from "./components/LinktoPgBtn.js";
import emptypfp from "../universal_components/universal_assets/emptypfp.svg"
import logoutimg from "../universal_components/universal_assets/logout.svg"
import Dock from "../universal_components/Dock.js"
import "./Index.css"
const Dashboard = ({ setAuth }) => {
  const naviagate = useNavigate()
  const [name, setName] = useState("");
  const items = [
    { icon: <DashbordBtn  size={50} img_path={logoutimg}/>, label: 'Logout', onClick: e => logout(e) },
    { icon: <DashbordBtn  size={50} img_path={emptypfp}/>, label: 'Profile', onClick: () => naviagate("/profile") },
    // { icon: <LinktoPgBtn  size={60}/>, label: 'Profile', onClick: () => alert('Profile!') },
    // { icon: <LinktoPgBtn  size={70}/>, label: 'Settings', onClick: () => alert('Settings!') },
  ];
  const logout = useCallback(() => {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.reload();
      toast.success("Logout successful");
    } catch (err) {
      console.error(err);
    }
  }, []);
  
  const getProfile = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/dashboard", {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.access_token}` }
      });
  
      const parseData = await res.json();
      console.log(parseData)
      if (parseData === "session over") {
        logout();
      } else if(parseData ==="null"){
        setName("");
      }
      else {
        setName(parseData);
      }
    } catch (err) {
      console.error(err.message);
      logout();
    }
  }, [logout]); // depends on logout
  
  

  

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  return (
    <div className="top-bar"> 
    <div>
      <TextType text={[`Welcome ${name}`]}typingSpeed={75}pauseDuration={1500}showCursor={true}cursorCharacter="|"/>
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