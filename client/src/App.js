import './App.css';
import React, { Fragment, useState, useEffect } from "react";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Login from "./Pages/LoginPg/Login/Index.tsx";
import SignupUser from "./Pages/LoginPg/Signup/Index.tsx";
import Dashboard from './Pages/Dashboard/Index.tsx';
import Profile from './Pages/Profile/Index.tsx';
import NotifPage from './Pages/Notifications/Index.tsx';
import Bio from './Pages/Bio/Index.tsx';

//BaaS client side
import supabase from './supabase-client.js';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthenticated = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("http://localhost:5000/auth/verify", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
  
      const parseRes = await res.json();
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
                  <Profile />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
              <Route
                path="/notifications"
                element={
                  isAuthenticated ? (
                    <NotifPage />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/bio"
                element={
                  isAuthenticated ? (
                    <Bio />
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
