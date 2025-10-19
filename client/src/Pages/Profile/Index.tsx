import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

//Assets

//Components/Styles
import { GradForm, EmployerForm } from "./components/FormTypes.tsx";
import { BioFormComponent } from "../Bio/Index.tsx";
import "./Index.css";

//Functions
import { returnGradStatus } from "./components/functions/ProfileRoutes.tsx";
interface ProfileProps {
  url: string | null;
}
export default function Profile({ url }: ProfileProps) {
  const [gradStatus, setGradStatus] = useState<null | boolean>(null);
  const [showGradForm, setShowGradForm] = useState<boolean>(true);
  useEffect(() => {
    const fetchGradStatus = async () => {
      const profileName = await returnGradStatus();
      setGradStatus(profileName.isgrad);
    };
    fetchGradStatus();
  }, []);

  return (
    <>
      <div>
        {gradStatus === null ? (
          <h1 className="titletxt">Loading...</h1>
        ) : gradStatus === true ? (
          <>
            <div>
              <button
                type="button"
                onClick={() => setShowGradForm(!showGradForm)}
                className="switch-btn"
                data-testid="switch-btn"
              >{`Switch to ${
                showGradForm ? "User Profile" : "Personal information"
              }`}</button>
              {showGradForm ? (
                <div data-testid="Profile">
                  <GradForm url={url} />
                </div>
              ) : (
                <div data-testid="Bio">
                  <BioFormComponent />
                </div>
              )}
            </div>
          </>
        ) : (
          <div data-testid="Employer">
            <EmployerForm url={url} />
          </div>
        )}
      </div>
    </>
  );
}
