import React, { useState } from "react";
import DashbordBtn from "../Dashboard/components/LinktoPgBtn";
import Dock from "../universal_components/Dock";
import { useNavigate } from "react-router-dom";
import "./Index.css";
import dashboardimg from "../universal_components/universal_assets/dashboard.svg";
import InputForm from "../LoginPg/components/InputForm.tsx";
export default function Profile() {
  const navigate = useNavigate();
  const items = [
    {
      icon: <DashbordBtn size={50} img_path={dashboardimg} />,
      label: "Back To Dashboard",
      onClick: () => navigate("/dashboard"),
    },
    // { icon: <LinktoPgBtn  size={60}/>, label: 'Profile', onClick: () => alert('Profile!') },
    // { icon: <LinktoPgBtn  size={70}/>, label: 'Settings', onClick: () => alert('Settings!') },
  ];
  const [inputs, setInputs] = useState({
    firstname: "",
    lastname: "",
    bio: "",
  });

  const { firstname, lastname, bio } = inputs;

  const onChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  const handleUpdate = (e) => {
    e.preventDefault();
    // your update logic here
  };

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
        <form onSubmit={handleUpdate}>
          <InputForm
            img={null}
            onChange={(e) => onChange(e)}
            name="email"
            value={firstname}
            type="text"
            placeholder="First Name"
          />
          <InputForm
            img={null}
            onChange={(e) => onChange(e)}
            name="password"
            value={lastname}
            type="password"
            placeholder="Last Name"
          />
          <InputForm
            img={null}
            onChange={(e) => onChange(e)}
            name="password"
            value={bio}
            type="password"
            placeholder="Bio"
          />

          <div className="submit-container">
            <button className="submit">Update</button>
          </div>
        </form>
      </div>
    </>
  );
}
