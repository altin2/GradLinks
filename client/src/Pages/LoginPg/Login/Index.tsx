import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import "./Index.css";
import { toast } from "react-toastify";
import email_icon from "./Assets/emailicon.png";
import pass_icon from "./Assets/passicon.png";
import InputForm from "../components/InputForm.tsx";
import supabase from "../../../supabase-client.js";
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        toast.error(error.message);
        setAuth(false);
        return;
      }

      // Supabase automatically saves tokens in localStorage
      setAuth(true);
      toast.success("Logged in Successfully");
      // supabase.auth.onAuthStateChange((event, session) => {
      //   console.log("Auth event:", event, session);
      // });
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
