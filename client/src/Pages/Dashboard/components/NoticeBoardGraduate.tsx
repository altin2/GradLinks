import React, { useState, useEffect, ReactNode } from "react";
import verified from "../../universal_components/universal_assets/verified.svg";
import "../Index.css";
//Components
import supabase from "../../../supabase-Client";
//Functions
import { RetrieveRelevantNotices } from "./functions/NoticeBoardFunctions";
import { returnGradInfo } from "../../Profile/components/functions/ProfileRoutes";
import LargeInputForm from "../../Profile/components/LargeInpForm";
import { SendNotification } from "../../Notifications/components/functions/NotificationRoutes";

export interface RevealButtonProps {
  children: ReactNode; // children can be any valid React content
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
  const [selectedSender, setSelectedSender] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

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

  const OnChangeMsg = (e: any) => setMsg(e.target.value);

  const SendMessage = async () => {
    if (!selectedSender) return;
    await SendNotification(selectedSender, msg);
    setMsg("");
    setSelectedSender(null);
  };

  const renderNotices = (arr: any) => {
    return arr.map((notice: any, idx: number) => {
      const { data } = supabase.storage
        .from("user_post_images")
        .getPublicUrl(`Public/${notice.id}`);
      const source = data?.publicUrl ?? "";
      return (
        <div key={idx} className="flex-container">
          <div className="notice-container">
            <div className="title">
              {notice.Title}
              {notice.Verified_Poster ? (
                <img src={verified} className="img-intitle" />
              ) : (
                <></>
              )}
            </div>
            <div className="img-container">
              {source && <img src={source} />}
            </div>
          </div>

          <RevealButton>
            <div className="desc-container">
              <div className="mid-container">
                <div className="message">{notice.message}</div>
              </div>{" "}
              <div className="title">Prerequisites</div>
              <div className="message">{notice.requiredDegree}</div>
              {notice.required_skills.length > 0 ? (
                <>
                  {" "}
                  <div className="subheader-title">Required skills</div>
                  {notice.required_skills.map((skill: any, idx2: number) => {
                    return (
                      <div className="row" key={idx2}>
                        <div className="bullet-point" /> <div>{skill}</div>{" "}
                      </div>
                    );
                  })}{" "}
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
                <div className="bullet-point" />{" "}
                <div>{notice.required_work_years}</div>
              </div>
              <button
                className="message-button"
                data-toggle="modal"
                data-target="#GlobalMessageModal"
                data-testid={`msg-${idx}`}
                onClick={() => setSelectedSender(notice.poster_id)}
              >
                Send a message!
              </button>
            </div>
          </RevealButton>
        </div>
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

      {/* Renders modal at root to display on the full screen.*/}
      <div
        className="modal fade"
        id="GlobalMessageModal"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content dark-bg">
            <div className="modal-header">
              <h5 className="modal-title white-txt">Message Employer:</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body">
              <LargeInputForm
                onChange={OnChangeMsg}
                name="bio_description"
                value={msg}
                placeholder="Write your message (400 chars max)"
                rows={5}
                cols={10}
                maxTxtSize={1000}
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={SendMessage}
                data-dismiss="modal"
              >
                Send message
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function RevealButton({ children }: RevealButtonProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="reveal-wrapper">
      <div className={`desc-panel ${revealed ? "show" : "hide"}`}>
        {children}
      </div>
      <button
        className={`reveal-btn ${revealed ? "btn-show" : "btn-hide"}`}
        onClick={() => setRevealed(!revealed)}
      >
        {revealed ? "<--" : "-->"}
      </button>
    </div>
  );
}
