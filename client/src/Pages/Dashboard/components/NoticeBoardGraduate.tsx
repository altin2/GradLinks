import React, { useState, useEffect } from "react";

import "../Index.css";
//Components
import supabase from "../../../supabase-client";
//Functions
import { RetrieveRelevantNotices } from "./functions/NoticeBoardFunctions";
import { returnGradInfo } from "../../Profile/components/functions/ProfileRoutes";

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
  const renderNotices = (arr) => {
    return arr.map((notice, idx) => {
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
          <div key={idx} className="notice-container">
            <div className="title">{notice.Title}</div>
            <div className="flex-container">
              <div className="img-container">
                {source === "" ? <></> : <img src={source} />}
              </div>
              <button className="reveal-btn">{"->>"}</button>
            </div>
            {/* <div className="mid-container">
              <div className="message">{notice.message}</div>
            </div>
            <div className="desc-container">
              <div className="title">Prerequisites (scroll)</div>
              <div className="message">{notice.requiredDegree}</div>
              {notice.required_skills.length > 0 ? (
                <>
                  <div className="subheader-title">Required skills</div>
                  {notice.required_skills.map((skill, idx2) => {
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
            </div> */}
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
