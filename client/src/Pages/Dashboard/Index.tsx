
import React, { useEffect, useState} from "react";
import { toast } from "react-toastify";
import TextType from './components/TextType.js';
import DashbordBtn from "./components/LinktoPgBtn.js";
import emptypfp from "./components/assets/emptypfp.svg"
import logoutimg from "./components/assets/logout.svg"
import Dock from "./components/Dock.js"
const Dashboard = ({ setAuth }) => {
  const [name, setName] = useState(null);
  const items = [
    { icon: <DashbordBtn  size={50} img_path={logoutimg}/>, label: 'Logout', onClick: e => logout(e) },
    { icon: <DashbordBtn  size={50} img_path={emptypfp}/>, label: 'Profile', onClick: () => alert('Profile!') },
    // { icon: <LinktoPgBtn  size={60}/>, label: 'Profile', onClick: () => alert('Profile!') },
    // { icon: <LinktoPgBtn  size={70}/>, label: 'Settings', onClick: () => alert('Settings!') },
  ];
  const getProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/dashboard", {
        method: "GET",
        headers: { jwt_token: localStorage.access_token }
      });
      
      const parseData = await res.json();
      if (parseData===undefined){
        setName("New User")
      }else{
        setName(parseData);
      }
      
    } catch (err) {
      console.error(err.message);
    }
  };

  const logout = async e => {
    e.preventDefault();
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setAuth(false);
      toast.success("Logout successfully");
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

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