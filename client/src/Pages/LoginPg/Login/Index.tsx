import React, { Provider, useState } from "react";
import { Link } from "react-router-dom";
import "./Index.css";
import { toast } from "react-toastify";
import email_icon from "./Assets/emailicon.png";
import pass_icon from "./Assets/passicon.png";
import google from "./Assets/google.png";
import linkedIn from "./Assets/linkedIn.png";
import InputForm from "../components/InputForm.tsx";
import supabase from "../../../supabase-Client.js";

const Login = ({ setAuth }: any) => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const { email, password } = inputs;

  const onChange = (e: any) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  const signIn = async (id: any) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: id,
    });
  };
  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

      setAuth(true);
      toast.success("Logged in Successfully");
    } catch (err: any) {
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
          <div className="side-by-side">
            <img
              src={google}
              alt="Google Sign In"
              className="img-oAuth"
              onClick={() => signIn("google")}
              style={{ cursor: "pointer" }}
              data-testid="oAuthGoogle"
            />
            <img
              src={linkedIn}
              alt="LinkedIn Sign In"
              className="img-oAuth"
              onClick={() => signIn("linkedin_oidc")}
              style={{ cursor: "pointer" }}
              data-testid="oAuthLinkedIn"
            />
          </div>
          <form onSubmit={onSubmitForm} autoComplete="off">
            <InputForm
              img={email_icon}
              onChange={(e: any) => onChange(e)}
              name="email"
              value={email}
              type="email"
              placeholder="Email"
              data-testid="email-input"
            />
            <InputForm
              img={pass_icon}
              onChange={(e: any) => onChange(e)}
              name="password"
              value={password}
              type="password"
              placeholder="Password"
              data-testid="pass-input1"
            />

            <div className="submit-container">
              <button className="submit" type="submit">
                Log In
              </button>
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
