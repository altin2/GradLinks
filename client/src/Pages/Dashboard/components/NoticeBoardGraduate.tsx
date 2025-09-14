import React, { useState, useEffect, ReactNode } from "react";

import "../Index.css";
//Components
import supabase from "../../../supabase-client";
//Functions
import { RetrieveRelevantNotices } from "./functions/NoticeBoardFunctions";
import { returnGradInfo } from "../../Profile/components/functions/ProfileRoutes";
export interface RevealButtonProps {
  children: ReactNode;  // children can be any valid React content
}
export interface Grad {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  age: number;
  attended_uni: string[];
  bio_description: string;
  degree_type: string;
  skills_desc: string[];
  work_years: number;
}
export function NoticeBoardGrad() {
  const [grad, setGrad] = useState<Grad | null>(null);
  const [notices, setNotices] = useState<any[]>([]);
  //returns graudate info when available for the notice baords
  useEffect(() => {
    const fetchGrad = async () => {
      if (!grad) {
        setGrad(await returnGradInfo());
      }
    };
    fetchGrad();
  }, [grad]);
  useEffect(() => {
    if (!grad) return;

    const fetchNotices = async () => {
      const noticeArr = await RetrieveRelevantNotices(
        grad.work_years,
        grad.skills_desc,
        grad.degree_type
      );
      setNotices(noticeArr);
    };

    fetchNotices();
  }, [grad]);
  const renderNotices = (arr:any) => {
    return arr.map((notice:any, idx:number) => {
      //If there's an image ascosiated with the post, return it
      const { data } = supabase.storage
        .from("user_post_images")
        .getPublicUrl(`Public/${notice.id}`);
      var source = "";
      if (data) {
        source = data.publicUrl;
      }

      
      return (
        <>
          <div key={idx} className="flex-container">
            <div className="notice-container glass-card">
            <div className="title">{notice.Title}</div>
            <div className="img-container">
                {source === "" ? <></> : <img src={source} />}
              </div>
            </div>
          <RevealButton>
            <div className="desc-container">
            <div className="mid-container">
              <div className="message">{notice.message}</div>
            </div>
              <div className="title">Prerequisites</div>
              <div className="message">{notice.requiredDegree}</div>
              {notice.required_skills.length > 0 ? (
                <>
                  <div className="subheader-title">Required skills</div>
                  {notice.required_skills.map((skill:any, idx2:number) => {
                    return (
                      <div className="row" key={idx2}>
                        <div className="bullet-point" />
                        <div>{skill}</div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <></>
              )}
              <div className="subheader-title">Minimum required Degree:</div>
              <div className="row">
                <div className="bullet-point" />
                <div>{notice.required_degree}</div>
              </div>
              <div className="subheader-title">Required Work years:</div>
              <div className="row">
                <div className="bullet-point" />
                <div>{notice.required_work_years}</div>
              </div>
            </div>
            </RevealButton>
            
          </div>
        </>
      );
    });
  };
  return (
    <>
      {grad ? (
        <div className="board-container">{renderNotices(notices)}</div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}

function RevealButton({ children }: RevealButtonProps) {
  const [revealed, setRevealed] = useState(false)

  const toggleReveal = () => setRevealed(!revealed)

  return (
    <div className="reveal-container">
  
  <button
    id={revealed ? "reveal-btn-right" : "reveal-btn"}
    onClick={toggleReveal}
  >
    {revealed ? "<--" : "-->"}
  </button>
  <div className={`desc-container ${revealed ? "show" : "hide"} glass-card`}>
    {children}
  </div>
</div>


  )
}
