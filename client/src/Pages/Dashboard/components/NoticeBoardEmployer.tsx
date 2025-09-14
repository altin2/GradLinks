import React, { useState, useEffect } from "react";
import { Grad } from "./NoticeBoardGraduate";
import "../Index.css";
//Components
import supabase from "../../../supabase-client";
import InputForm from "../../LoginPg/components/InputForm";
import { SkillsType } from "../../universal_components/FormTypes";
//Functions
import {
  PostNotice,
  RetrieveRandomNotices,
} from "./functions/NoticeBoardFunctions";
import LargeInputForm from "../../Profile/components/LargeInpForm";

export function NoticeBoardEmployer() {
  const [notices, setNotices] = useState<any[]>([]);
  const [inputs, setInputs] = useState({
    degree_type: "",
    work_years: 0,
    work_years_boundary: 0,
    skills_description: [],
    message: "",
    title: "",
    file: null,
  });
  const initialState = {
    degree_type: "",
    work_years: 0,
    work_years_boundary: 0,
    skills_description: [],
    message: "",
    title: "",
    file: null,
  };
  const [selectedSign, setSelectedSign] = useState(">");
  //returns graudate info when available for the notice baords
  useEffect(() => {
    const fetchNotices = async () => {
      const noticeArr = await RetrieveRandomNotices();
      setNotices(noticeArr);
    };

    fetchNotices();
  }, []);

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
            <div className="img-container">
              {source === "" ? <></> : <img src={source} />}
            </div>
            <div className="mid-container">
              <div className="title">{notice.Title}</div>
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
            </div>
          </div>
        </>
      );
    });
  };
  const OnChangeForm = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };
  const OnChangeSign = (e) => {
    setSelectedSign(e.target.value);
  };
  const OnChangeFormSkills = (skills) => {
    setInputs((prev) =>
      prev.skills_description === skills
        ? prev
        : { ...prev, skills_description: skills }
    );
  };
  async function uploadImage(e) {
    setInputs({ ...inputs, [e.target.name]: e.target.files[0] });
  }
  const submitPostForm = async () => {
    var WorkParams = "";
    if (selectedSign === "<>") {
      WorkParams = `${inputs.work_years} ${selectedSign} ${inputs.work_years_boundary}`;
    } else {
      WorkParams = `${selectedSign} ${inputs.work_years} `;
    }
    await PostNotice(
      inputs.message,
      inputs.degree_type,
      inputs.skills_description,
      WorkParams,
      inputs.title,
      inputs.file
    );
    setInputs({ ...initialState });
  };

  const renderPostNotices = () => {
    return (
      <>
        <button
          className="post-btn"
          data-toggle="modal"
          data-target="#Send_Notice"
        >
          Post a notice:
        </button>
        <div
          className="modal fade"
          id="Send_Notice"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">
                  Enter information into the form below:
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
                <form>
                  <h1 className="titletxt">Upload an image:</h1>
                  <input
                    type="file"
                    name="file"
                    onChange={(e) => uploadImage(e)}
                  />
                  <h1 className="titletxt">Title</h1>
                  <InputForm
                    img={null}
                    onChange={OnChangeForm}
                    name="title"
                    value={inputs.title}
                    type="text"
                    placeholder="Enter title here:"
                  />
                  <h1 className="titletxt">Description</h1>
                  <LargeInputForm
                    onChange={OnChangeForm}
                    name="message"
                    value={inputs.message}
                    placeholder="Enter description here (max 500 words):"
                    rows={3}
                    cols={40}
                    maxTxtSize={500}
                  />
                  <h1 className="titletxt">Minimum Degree type</h1>
                  <fieldset>
                    <select
                      className="form-control dropdown"
                      id="education"
                      name="degree_type"
                      value={inputs.degree_type}
                      onChange={OnChangeForm}
                    >
                      <option value="" disabled={true}>
                        -- select one --
                      </option>
                      <option value="No formal education">
                        No formal education
                      </option>
                      <option value="Primary education">
                        Primary education
                      </option>
                      <option value="Secondary education">
                        Secondary education or high school
                      </option>
                      <option value="GED">GED</option>
                      <option value="Vocational qualification">
                        Vocational qualification
                      </option>
                      <option value="Bachelor's degree">
                        Bachelor's degree
                      </option>
                      <option value="Master's degree">Master's degree</option>
                      <option value="Doctorate or higher">
                        Doctorate or higher
                      </option>
                    </select>
                  </fieldset>
                  <h1 className="titletxt">Work Years</h1>
                  <fieldset>
                    <select
                      className="form-control dropdown"
                      id="sign"
                      name="sign"
                      onChange={OnChangeSign}
                    >
                      <option value="" disabled={true}>
                        -- select one --
                      </option>
                      <option value=">">Greater than</option>
                      <option value=">=">Greater than or equal to</option>
                      <option value="<">Less than</option>
                      <option value="<=">Less than or equal to</option>
                      <option value="<>">Between </option>
                    </select>
                  </fieldset>
                  {selectedSign === "<>" ? (
                    <>
                      <InputForm
                        img={null}
                        onChange={OnChangeForm}
                        name="work_years"
                        value={inputs.work_years}
                        type="number"
                        placeholder="First Value"
                      />
                      <InputForm
                        img={null}
                        onChange={OnChangeForm}
                        name="work_years_boundary"
                        value={inputs.work_years_boundary}
                        type="number"
                        placeholder="Second Value"
                      />
                    </>
                  ) : (
                    <InputForm
                      img={null}
                      onChange={OnChangeForm}
                      name="work_years"
                      value={inputs.work_years}
                      type="number"
                      placeholder="Enter here"
                    />
                  )}

                  <h1 className="titletxt">Skills</h1>
                  <SkillsType
                    defaultValue={inputs.skills_description}
                    onChange={OnChangeFormSkills}
                  />
                </form>
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
                  onClick={submitPostForm}
                  data-dismiss="modal"
                >
                  Post Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      {notices.length > 0 ? (
        <>
          <div>{renderPostNotices()}</div>
          <div className="board-container">{renderNotices(notices)}</div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
