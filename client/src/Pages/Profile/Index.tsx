import React,{useState} from "react"
import DashbordBtn from "../Dashboard/components/LinktoPgBtn"
import Dock from "../universal_components/Dock";
import { useNavigate } from "react-router-dom";
import "./Index.css"
import emptypfp from "../universal_components/universal_assets/emptypfp.svg"
import InputForm from "../LoginPg/components/InputForm.tsx";
export default function Profile (){
    const navigate = useNavigate()
    const items = [
        { icon: <DashbordBtn  size={50} img_path={emptypfp}/>, label: 'Dashboard', onClick: () => navigate("/dashboard") },
        // { icon: <LinktoPgBtn  size={60}/>, label: 'Profile', onClick: () => alert('Profile!') },
        // { icon: <LinktoPgBtn  size={70}/>, label: 'Settings', onClick: () => alert('Settings!') },
      ];
      const [inputs, setInputs] = useState({
        firstname: "",
        lastname: "",
      });
    
      const { firstname,lastname } = inputs;
    
      const onChange = (e) =>
        setInputs({ ...inputs, [e.target.name]: e.target.value });
      const handleUpdate = (e) => {
        e.preventDefault(); 
        // your update logic here
        console.log("Updating with:", firstname, lastname);
      };
      
    return(
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
              placeholder="Email"
            />
            <InputForm
              img={null}
              onChange={(e) => onChange(e)}
              name="password"
              value={lastname}
              type="password"
              placeholder="Password"
            />

            <div className="submit-container">
              <button className="submit">Update</button>
            </div>
    </form>
    </div>
    </>
    )

}
    
