import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TextType from './TextType';
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
      <button onClick={e => logout(e)} className="btn btn-primary">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;