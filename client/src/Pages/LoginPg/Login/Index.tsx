import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import "./Index.css";
import { toast } from "react-toastify";
import email_icon from "./Assets/emailicon.png";
import pass_icon from "./Assets/passicon.png";
import InputForm from "../components/InputForm.tsx";

const Login = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const { email, password } = inputs;
  
  const onChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    try {
      const body = { email, pass: password };

      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();
      //Checks for errors
      if (!!parseRes[0] && typeof parseRes !== "string") {
        localStorage.setItem("access_token", parseRes[0]);
        localStorage.setItem("refresh_token", parseRes[1]);
        setAuth(true);
        toast.success("Logged in Successfully");
      } else {
        setAuth(false);
        toast.error(parseRes);
      }
    } catch (err) {
      console.error(`In Login: ${err.message}`);
    }
  };

  return (
    <>
      <div className="bg-container"></div>
      <div className="login-container">
        <div className="header">
          <div className="text">Login Page</div>
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
              img={pass_icon}
              onChange={(e) => onChange(e)}
              name="password"
              value={password}
              type="password"
              placeholder="Password"
            />

            <div className="submit-container">
              <button className="submit">Log In</button>
            </div>
          </form>
          <div className="submit-container">
            <p className="text-acc">Don't have an account? </p>
            <Link to="/signup">Register</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
