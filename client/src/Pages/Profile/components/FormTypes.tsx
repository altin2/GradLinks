import InputForm from "../../LoginPg/components/InputForm.tsx";
import React, { useState,useEffect } from "react";
import { returnGradInfo,updateGradInfo } from "./functions/ProfileRoutes.tsx";
import { toast } from "react-toastify";
import"../Index.css"
export function GradForm(){
  
    const [inputs, setInputs] = useState({
      firstname: "",
      lastname: "",
      midname:"",
      age:"",
      bio: "",
    });
    useEffect(() => {
      const fetchGradStatus = async () => {
        const UserGrad = await returnGradInfo()
        setInputs(prev => ({
          ...prev,
          firstname: UserGrad.first_name,
          lastname: UserGrad.last_name,
          midname: UserGrad.middle_name,
          age: UserGrad.age
        }))
      };
      fetchGradStatus();
      
    }, [])
    const { firstname, lastname,midname,age, bio } = inputs;
  
    const onChange = (e) =>
      setInputs({ ...inputs, [e.target.name]: e.target.value });
    
    
    const handleUpdate = async (e) => {
      e.preventDefault();
      const body = {first_name:firstname,last_name:lastname,middle_name:midname,age}
      
      const response = await updateGradInfo(body)
      {response==="Success"?toast.success(response):toast.error(response)}
      // your update logic here
    };
    return(
      <form onSubmit={handleUpdate}>
            <h1 className="titletxt">First name</h1>
            <InputForm
        img={null}
        onChange={onChange}
        name="firstname"
        value={firstname}
        type="text"
        placeholder="First Name"
      />
      <h1 className="titletxt">Middle name</h1>
      <InputForm
        img={null}
        onChange={onChange}
        name="midname"
        value={midname}
        type="text"
        placeholder="Middle Name"
      />
      <h1 className="titletxt">Last name</h1>
      <InputForm
        img={null}
        onChange={onChange}
        name="lastname"
        value={lastname}
        type="text"
        placeholder="Last Name"
      />
      <h1 className="titletxt">Age</h1>
      <InputForm
        img={null}
        onChange={onChange}
        name="age"
        value={age}
        type="number"
        placeholder="Age"
      />
      <h1 className="titletxt">Bio</h1>
      <InputForm
        img={null}
        onChange={onChange}
        name="bio"
        value={bio}
        type="text"
        placeholder="Bio"
      />
            
            
            
  
            <div className="submit-container">
              <button className="submit">Update</button>
            </div>
          </form>
    )
  }
export  function EmployerForm(){
    
    const [inputs, setInputs] = useState({
      compname: "",
      bio: "",
    });
  
    const { compname,bio } = inputs;
  
    const onChange = (e) =>
      setInputs({ ...inputs, [e.target.name]: e.target.value });
    
    
    const handleUpdate = (e) => {
      e.preventDefault();
      
      // your update logic here
    };
    return(
      <form onSubmit={handleUpdate}>
            
            <InputForm
              img={null}
              onChange={(e) => onChange(e)}
              name="name"
              value={compname}
              type="text"
              placeholder="Company Name"
            />
            <InputForm
              img={null}
              onChange={(e) => onChange(e)}
              name="password"
              value={bio}
              type="text"
              placeholder="Bio"
            />
            
            
            
  
            <div className="submit-container">
              <button className="submit">Update</button>
            </div>
          </form>
    )
  }
