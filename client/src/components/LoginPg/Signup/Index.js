import "./Index.css";
import phone_icon from "./Assets/phone-1.png";
import email_icon from "./Assets/emailicon.png";
import pass_icon from "./Assets/passicon.png";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const SignupUser = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    phonenumber: ""
  });

  const { email, password, phonenumber} = inputs;

  const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const body = { email, pass: password, phonenumber };
      const response = await fetch(
        "http://localhost:5000/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(body)
        }
      );
      const parseRes = await response.json();

      if (parseRes.jwtToken) {
        localStorage.setItem("token", parseRes.jwtToken);
        setAuth(true);
        toast.success("Register Successfully");
      } else {
        setAuth(false);
        toast.error(parseRes);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div classname = 'container'>
        <div className="header">
            <div className="text">Sign Up Page</div>
            <div className ="underline"></div>
        </div>
        <div className="inputs">
            <form onSubmit={onSubmitForm}>
            <div className="input">
                <img src={email_icon} alt=""/>
                <input type="text"name="email"value={email}placeholder="email"onChange={e => onChange(e)}className="form-control my-3"/>
            </div>
            <div className="input">
                <img src={phone_icon} alt=""/>
                <input type="tel"name="phonenumber"value={phonenumber}placeholder="phone number"onChange={e => onChange(e)}className="form-control my-3"/>
            </div>
            <div className="input">
                <img src={pass_icon} alt=""/>
                <input type="password"name="password"value={password}placeholder="password"onChange={e => onChange(e)}className="form-control my-3"/>
            </div>
            <div className="submit-container">
                <button className="submit">Sign Up</button>
            </div>
            </form>
            <div className="submit-container">
                <Link to="/login">Login</Link>
            </div>
            

        </div>
            
    </div>
    
    );
};

export default SignupUser;