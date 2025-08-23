import InputForm from "../../LoginPg/components/InputForm.tsx";
import React, { useState,useEffect } from "react";
export function GradForm(){
  
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
    return(
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
  