//Packages
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DarkVeil from "../universal_components/DarkVeil";
//Components or Types
import Dock from "../universal_components/Dock";
import DashbordBtn from "../Dashboard/components/LinktoPgBtn";
import { ResultsTable } from "./components/ResultsComponent";
import { UserPublic } from "./components/ResultsComponent";
//Images
import returnBack from "../universal_components/universal_assets/dashboard.svg";
import { SearchAlgoInputForm } from "./components/SearchAlgoForm";

export default function SearchPage() {
  const navigate = useNavigate();
  const [results, setResults] = useState<UserPublic[]>([]);
  const items = [
    {
      icon: <DashbordBtn size={50} img_path={returnBack} />,
      label: "Back to dashboard",
      onClick: () => navigate("/dashboard"),
    },
  ];
  const recieveResponse = (response: any) => {
    setResults(response ?? []);
  };
  return (
    <>
      <div className="bg-div">
        <DarkVeil />
      </div>
      <div className="top-bar">
        <Dock
          items={items}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
      </div>
      {results.length > 0 ? (
        <ResultsTable results={results} />
      ) : (
        <SearchAlgoInputForm onChange={recieveResponse} />
      )}
    </>
  );
}
