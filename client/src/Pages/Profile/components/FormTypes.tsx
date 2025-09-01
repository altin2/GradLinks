import InputForm from "../../LoginPg/components/InputForm.tsx";
import React, { useState,useEffect } from "react";
import { returnGradInfo,updateGradInfo,returnEmpInfo,updateEmpInfo } from "./functions/ProfileRoutes.tsx";
import { toast } from "react-toastify";
import LargeInputForm from "./LargeInpForm.tsx";
import"../Index.css"
export function GradForm(){
  
    const [inputs, setInputs] = useState({
      firstname: "",
      lastname: "",
      midname:"",
      age:"",
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
    const { firstname, lastname,midname,age} = inputs;
  
    const onChange = (e) =>
      setInputs({ ...inputs, [e.target.name]: e.target.value });
    
    
    const handleUpdate = async (e) => {
      e.preventDefault();
      const body = {first_name:firstname,last_name:lastname,middle_name:midname,age}
      
      const response = await updateGradInfo(body)
      {response==="Success"?toast.success(response):toast.error(response)}
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
    useEffect(() => {
      const fetchEmpStatus = async () => {
        const UserEmp = await returnEmpInfo()
        setInputs(prev => ({
          ...prev,
          compname: UserEmp.company_name,
          bio: UserEmp.bio,
        }))
      };
      fetchEmpStatus();
      
    }, [])
    const { compname,bio } = inputs;
  
    const onChange = (e) =>
      setInputs({ ...inputs, [e.target.name]: e.target.value });
    
    
    const handleUpdate = async (e) => {
      e.preventDefault();
      const body = {company_name:compname,bio}
      
      const response = await updateEmpInfo(body)
      {response==="Success"?toast.success(response):toast.error(response)}
    };
    return(
      <form onSubmit={handleUpdate}>
            <h1 className="titletxt">Company name</h1>
            <InputForm
              img={null}
              onChange={onChange}
              name="compname"
              value={compname}
              type="text"
              placeholder="Company Name"
            />
            <h1 className="titletxt">Company Bio</h1>
            <LargeInputForm 
            rows='5' 
            cols='50' 
            placeholder="Company Bio" 
            value={bio} 
            onChange={onChange} 
            name="bio"/>
          
            <div className="submit-container">
              <button className="submit">Update</button>
            </div>
          </form>
    )
  }
