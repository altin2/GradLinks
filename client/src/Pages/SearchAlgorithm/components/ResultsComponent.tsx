import React, { useState } from "react";
import "../Index.css";
import LargeInputForm from "../../Profile/components/LargeInpForm";
import { SendNotification } from "../../Notifications/components/functions/NotificationRoutes";
import supabase from "../../../supabase-Client";
import emptypfp from "../../universal_components/universal_assets/emptypfp.svg";

export interface UserPublic {
  age: number;
  attended_uni: string[];
  bio_description: string;
  degree_type: string;
  first_name: string;
  id: string;
  last_name: string;
  skills_desc: string[];
  work_years: number;
  middle_name?: string;
}
interface ResultProps {
  results: UserPublic[];
}

export function ResultsTable({ results }: ResultProps) {
  const [msg, setMsg] = useState("");
  const OnChangeMsg = (e: any) => setMsg(e.target.value);
  const SendMessage = async (id: string, message: string) => {
    if (message.length <= 1000) await SendNotification(id, message);
  };
  return (
    <>
      <div className="side-by-side">
        {results.map((user) => {
          return (
            <div key={user.id} className="profile-container">
              <div className="name-header">
                {user.first_name ? user.first_name : "Anonymous User"}
                {user.middle_name} {user.last_name}
              </div>
              <ProfileImage userId={user.id} />
              <div className="bio">{user.bio_description}</div>
              <div className="subheader-title">Education:</div>
              <div className="term-wrapper">
                <div className="bullet-point"></div>
                <div className="term-text">{user.degree_type}</div>
              </div>
              {user.attended_uni.length > 0 ? (
                <div className="subheader-title">Universities attended:</div>
              ) : (
                <></>
              )}
              {user.attended_uni.length > 0 && (
                <>
                  {user.attended_uni.map((uni, i) => (
                    <div key={i} className="term-wrapper">
                      <div className="bullet-point"></div>
                      <div className="term-text">{uni}</div>
                    </div>
                  ))}
                </>
              )}

              {user.skills_desc.length > 0 && (
                <>
                  <div className="subheader-title">Skills:</div>
                  {user.skills_desc.map((skill, i) => (
                    <div key={i} className="term-wrapper">
                      <div className="bullet-point"></div>
                      <div className="term-text">{skill}</div>
                    </div>
                  ))}
                </>
              )}
              <div className="subheader-title">
                Years of prior work experience: {user.work_years}
              </div>
              <button
                className="message-button"
                data-toggle="modal"
                data-target={`#Send_Msg_${user.id}`}
              >
                Send a message!
              </button>
              <div
                className="modal fade"
                id={`Send_Msg_${user.id}`}
                tabIndex={-1}
                role="dialog"
                aria-labelledby="exampleModalCenterTitle"
                aria-hidden="true"
              >
                <div
                  className="modal-dialog modal-dialog-centered"
                  role="document"
                >
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLongTitle">
                        Message {user.first_name}:
                      </h5>
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
                        placeholder={`Write to ${user.first_name} (400 chars max)`}
                        rows={5}
                        cols={10}
                        maxTxtSize={1000}
                        data-testid="mockLargeInput"
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
                        onClick={() => SendMessage(user.id, msg)}
                        data-dismiss="modal"
                      >
                        Send message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
function ProfileImage({ userId }: { userId: string }) {
  const { data } = supabase.storage
    .from("user_pfps")
    .getPublicUrl(`Public/${userId}`);

  const publicUrl = data?.publicUrl;
  const [imgSrc, setImgSrc] = useState(publicUrl || emptypfp);

  return (
    <img
      src={imgSrc}
      alt="Profile"
      className="img-container-2"
      onError={() => setImgSrc(emptypfp)}
    />
  );
}
