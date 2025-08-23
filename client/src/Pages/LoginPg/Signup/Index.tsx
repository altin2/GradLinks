import "./Index.css";
import InputForm from "../components/InputForm.tsx";
import phone_icon from "./Assets/phone-1.png";
import email_icon from "./Assets/emailicon.png";
import pass_icon from "./Assets/passicon.png";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { passCheck } from "../../../functions/routes.tsx";
const SignupUser = ({ setAuth }) => {
  const [isGrad, setIsGrad]=useState(false)
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    phonenumber: "",
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const { email, password, phonenumber } = inputs;
  const onGradChange =()=> {
    setIsGrad(!isGrad)
    console.log(`Changed grad to ${isGrad}!`)
}
  const onChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { email, pass: password, phonenumber,isGrad };
      //password verification using regular expressions
      const isValid = passCheck(password);
      
      if (isValid) {
        //Add all inputs to DB
        const response = await fetch("http://localhost:5000/auth/signup", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(body),
        });

        const parseRes = await response.json();
        if (!!parseRes && typeof parseRes !== "string") {
          setIsSubmit(true);
        } else {
          setAuth(false);
          toast.error(parseRes);
        }
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <div className="bg-container"></div>
      <div className="signup-container">
        <div className="header">
          <div className="text">Sign Up Page</div>
          <div className="underline"></div>
        </div>

        <div className="inputs">
          {isSubmit ? (
            <h4 className="text-center sticky-top">
              Registered! Verify with email.
            </h4>
          ) : (
            <>
            
            <form onSubmit={onSubmitForm}>
              <InputForm
                img={email_icon}
                onChange={(e) => onChange(e)}
                name="email"
                value={email}
                type="text"
                placeholder="Email"
              />
              <InputForm
                img={phone_icon}
                onChange={(e) => onChange(e)}
                name="phonenumber"
                value={phonenumber}
                placeholder="Phone number (optional)"
                type={null}
              />
              <InputForm
                img={pass_icon}
                onChange={(e) => onChange(e)}
                name="password"
                value={password}
                type="password"
                placeholder="Password"
              />
              <div onChange={()=>onGradChange()}> 
            <input type='radio' value="Employer" name="role" defaultChecked/> Employer
            <input type='radio' value="Graduate" name="role"/> Graduate
            </div>
              <div className="submit-container">
                <button className="submit">Sign Up</button>
              </div>
            </form>
            </>
          )}

          <div className="submit-container">
            <p className="text-acc">Already have an account? </p>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupUser;
