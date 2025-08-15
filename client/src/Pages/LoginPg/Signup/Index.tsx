import "./Index.css";
import InputForm from "../components/InputForm.tsx";
import phone_icon from "./Assets/phone-1.png";
import email_icon from "./Assets/emailicon.png";
import pass_icon from "./Assets/passicon.png";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { parse } from "path";
const SignupUser = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    phonenumber: "",
  });
  const navigate = useNavigate();
  const { email, password, phonenumber } = inputs;

  const onChange = (e) =>setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { email, pass: password, phonenumber };
      //password verification using regular expressions
      var isValid = true;

      if (password.length === 0) {
        toast.error("Cannot leave password blank");
        isValid = false;
      } else {
        if (password.length < 7) {
          toast.error("Pass must be more than 7 characters");
          isValid = false;
        }
        if (![...password].some((char) => /[A-Z]/.test(char))) {
          toast.error("Pass must contain at least 1 uppercase letter");
          isValid = false;
        }
        if (![...password].some((char) => /[a-z]/.test(char))) {
          toast.error("Pass must contain at least 1 lowercase letter");
          isValid = false;
        }
        if (
          ![...password].some((char) =>
            /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(char)
          )
        ) {
          toast.error("Pass must contain at least 1 special symbol");
          isValid = false;
        }
      } 
      

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

        if (parseRes.jwtToken) {
          localStorage.setItem("token", parseRes.jwtToken);
          // setAuth(true);
          toast.success("Registered, verify with email");
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
              placeholder="Phone number"
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
            <div className="submit-container">
              <button className="submit">Sign Up</button>
            </div>
          </form>
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
