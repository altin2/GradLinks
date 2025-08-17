import './App.css';
import React, { Fragment, useState, useEffect } from "react";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Login from "./Pages/LoginPg/Login/Index.tsx";
import SignupUser from "./Pages/LoginPg/Signup/Index.tsx";
import Dashboard from './Pages/Dashboard/Index.tsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthenticated = async () => {
    try {
      const res = await fetch("http://localhost:5000/auth/verify", {
        method: "POST",
        headers: { jwt_token: localStorage.access_token },
      });

      const parseRes = await res.json();
      console.log(parseRes)
      setIsAuthenticated(parseRes);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    checkAuthenticated();
  }, []);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  return (
    <Fragment>
      <Router>
        <div className="container">
          <ToastContainer />
          <Routes>
            <Route
              path="/"
              element={
                !isAuthenticated ? (
                  <Login setAuth={setAuth} />
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />
            <Route
              path="/login"
              element={
                !isAuthenticated ? (
                  <Login setAuth={setAuth} />
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />
            <Route
              path="/signup"
              element={
                !isAuthenticated ? (
                  <SignupUser setAuth={setAuth} />
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? (
                  <Dashboard setAuth={setAuth} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/profile"
              element={
                isAuthenticated ? (
                  <Dashboard setAuth={setAuth} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </div>
      </Router>
    </Fragment>
  );
}

export default App;
