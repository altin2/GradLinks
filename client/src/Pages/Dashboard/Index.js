import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TextType from './TextType';
import LinktoPgBtn from "./components/LinktoPgBtn";
const Dashboard = ({ setAuth }) => {
  const [name, setName] = useState("");

  const getProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/dashboard", {
        method: "GET",
        headers: { jwt_token: localStorage.token }
      });

      const parseData = await res.json();
      if (parseData.firstname===undefined){
        setName("New User")
      }else{
        setName(parseData.firstname);
      }
      
    } catch (err) {
      console.error(err.message);
    }
  };

  const logout = async e => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
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
    <div>
      <h1 className="mt-5">Dashboard</h1>
      <TextType text={[`Welcome ${name}`]}typingSpeed={75}pauseDuration={1500}showCursor={true}cursorCharacter="|"/>
      <LinktoPgBtn func={e => logout(e)} btnStyle="btn btn-primary" text="Logout"/>
    </div>
  );
};

export default Dashboard;