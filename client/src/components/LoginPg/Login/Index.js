import React, { Fragment, useState } from "react";
import { Link} from "react-router-dom";
import "./Index.css";
import { toast } from "react-toastify";
import email_icon from "./Assets/emailicon.png";
import pass_icon from "./Assets/passicon.png";
const Login = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    email: "",
    password: ""
  });

  const { email, password } = inputs;

  const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async e => {
    e.preventDefault(); // Prevent form from refreshing the page
    try {
      const body = { email, pass: password };

      const response = await fetch(
        "http://localhost:5000/auth/login",
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
        toast.success("Logged in Successfully");
      } else {
        setAuth(false);
        toast.error(parseRes);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <div className='bg-container'></div>
      <div className='login-container'>
          <div className="header">
              <div className="text">Login Page</div>
              <div className ="underline"></div>
          </div>
          <div className="inputs">
              <form onSubmit={onSubmitForm}>
              <div className="input">
                  <img src={email_icon} alt=""/>
                  <input type="text"name="email"value={email}placeholder="email"onChange={e => onChange(e)}className="form-control my-3"/>
              </div>
              <div className="input">
                  <img src={pass_icon} alt=""/>
                  <input type="password"name="password"value={password}placeholder="password"onChange={e => onChange(e)}className="form-control my-3"/>
              </div>
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