import "./Index.css";
import InputForm from "../components/InputForm.tsx";
import phone_icon from "./Assets/phone-1.png";
import email_icon from "./Assets/emailicon.png";
import pass_icon from "./Assets/passicon.png";
import React, { useState } from "react";
import supabase from "../../../supabase-Client.js";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { passCheck } from "../../../functions/Routes.tsx";
const SignupUser = ({ setAuth }: any) => {
  const [isGrad, setIsGrad] = useState(false);
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    password_confirm: "",
    phonenumber: "",
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const onGradChange = () => {
    setIsGrad(!isGrad);
    console.log(`Changed grad to ${isGrad}!`);
  };
  const onChange = (e: any) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  const onSubmitForm = async (e: any) => {
    e.preventDefault();
    try {
      const { email, password, password_confirm, phonenumber } = inputs;
      const body = { email, pass: password, isGrad, phonenumber };
      //password verification using regular expressions
      if (password === password_confirm) {
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
          //Error handling
          if (!!parseRes && typeof parseRes !== "string") {
            setIsSubmit(true);
          } else {
            setAuth(false);
            toast.error(parseRes);
          }
        }
      } else {
        toast.error("Passwords do not match.");
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
                  onChange={(e: any) => onChange(e)}
                  name="email"
                  value={inputs.email}
                  type="text"
                  placeholder="Email"
                  data-testid="email-input"
                />
                <InputForm
                  img={phone_icon}
                  onChange={(e: any) => onChange(e)}
                  name="phonenumber"
                  value={inputs.phonenumber}
                  placeholder="Phone number (optional)"
                />
                <InputForm
                  img={pass_icon}
                  onChange={(e: any) => onChange(e)}
                  name="password"
                  value={inputs.password}
                  type="password"
                  placeholder="Password"
                  data-testid="pass-input1"
                />
                <InputForm
                  img={pass_icon}
                  onChange={(e: any) => onChange(e)}
                  name="password_confirm"
                  value={inputs.password_confirm}
                  type="password"
                  placeholder="Confirm your password"
                  data-testid="pass-input2"
                />
                <div onChange={() => onGradChange()}>
                  <input
                    type="radio"
                    value="Employer"
                    name="role"
                    defaultChecked
                  />{" "}
                  Employer
                  <input type="radio" value="Graduate" name="role" /> Graduate
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
