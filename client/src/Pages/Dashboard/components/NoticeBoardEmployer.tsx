import React, { useState, useEffect } from "react";
import "../Index.css";
import { Modal } from "bootstrap";
import filter from "../../universal_components/universal_assets/filter.png";
import verified from "../../universal_components/universal_assets/verified.svg";
import { useRef } from "react";
//Components
import supabase from "../../../supabase-Client";
import InputForm from "../../LoginPg/components/InputForm";
import { SkillsType } from "../../universal_components/FormTypes";
import { RevealButton } from "./NoticeBoardGraduate";
//Functions
import {
  PostNotice,
  RetrieveRandomNotices,
  RetrievePersonalNotices,
} from "./functions/NoticeBoardFunctions";
import LargeInputForm from "../../Profile/components/LargeInpForm";
import { toast } from "react-toastify";

export function NoticeBoardEmployer() {
  const [notices, setNotices] = useState<any[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [personalNotices, setPersonalNotices] = useState<any[]>([]);
  const [inputs, setInputs] = useState({
    degree_type: "No formal education",
    work_years: 0,
    work_years_boundary: 0,
    skills_description: [],
    message: "",
    title: "",
    file: null,
    date: new Date(),
  });
  const initialState = {
    degree_type: "",
    work_years: 0,
    work_years_boundary: 0,
    skills_description: [],
    message: "",
    title: "",
    file: null,
    date: new Date(),
  };
  const [selectedSign, setSelectedSign] = useState(">");
  const [isFiltered, setIsFiltered] = useState<boolean>(false);

  //returns graudate info when available for the notice baords
  useEffect(() => {
    const fetchNotices = async () => {
      const noticeArr = await RetrieveRandomNotices();
      const filteredNoticeArr = await RetrievePersonalNotices();
      setNotices(noticeArr);
      setPersonalNotices(filteredNoticeArr);
    };

    fetchNotices();
  }, []);

  const renderNotices = (arr: any) => {
    if (!Array.isArray(arr) || arr.length === 0) {
      return <div>No notices available.</div>;
    }
    return arr.map((notice: any, idx: number) => {
      if (!notice) return null;
      //If there's an image ascosiated with the post, return it
      const { data } = supabase.storage
        .from("user_post_images")
        .getPublicUrl(`Public/${notice.id}`);
      var source = "";
      if (data) {
        source = data.publicUrl;
      }

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
                  {notice.required_skills.map((skill: any, idx2: number) => {
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
      );
    });
  };
  const OnChangeForm = (e: any) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };
  const OnChangeSign = (e: any) => {
    setSelectedSign(e.target.value);
  };
  const OnChangeFormSkills = (skills: any) => {
    setInputs((prev) =>
      prev.skills_description === skills
        ? prev
        : { ...prev, skills_description: skills }
    );
  };
  async function uploadImage(e: any) {
    setInputs({ ...inputs, [e.target.name]: e.target.files[0] });
  }
  const submitPostForm = async () => {
    var WorkParams = "";
    const today = new Date().toISOString().split("T")[0];
    if (selectedSign === "<>") {
      WorkParams = `${inputs.work_years} ${selectedSign} ${inputs.work_years_boundary}`;
    } else {
      WorkParams = `${selectedSign} ${inputs.work_years} `;
    }
    if (inputs.title.length < 1) {
      toast.error("Not all inputs were filled");
      return;
    } else if (
      inputs.title.length > 50 ||
      inputs.message.length > 1000 ||
      inputs.work_years < 0 ||
      inputs.work_years > 100 ||
      inputs.date < today
    ) {
      return;
    } else if (
      selectedSign === "<>" &&
      inputs.work_years > inputs.work_years_boundary
    ) {
      toast.error("First value for work years must be less than the second.");
      return;
    } else if (!inputs.file?.type.startsWith("image/")) {
      toast.error(
        "Please upload a valid image file (e.g., .png, .jpg, .jpeg, .gif)."
      );
      return;
    } else if (inputs.file?.size > 5 * 1024 * 1024) {
      toast.error("Image size must be under 5MB.");
      return;
    }
    await PostNotice(
      inputs.message,
      inputs.degree_type,
      inputs.skills_description,
      WorkParams,
      inputs.title,
      inputs.date,
      inputs.file
    );
    toast.success("Submitted Successfully");
    setModal(false);
    setInputs({ ...initialState });
  };

  const renderPostNotices = () => {
    return (
      <>
        <div
          className="filter-btn"
          data-testid="filterBtn"
          onClick={() => setIsFiltered(!isFiltered)}
        >
          <img src={filter} className="btn-mid" alt="filter" />
          <span className="tooltiptext">
            Click to filter for{" "}
            {isFiltered ? "random posts" : "your posts only"}
          </span>
        </div>

        <button
          className="post-btn"
          onClick={() => setModal(true)}
          data-testid="postBtn"
        >
          Post a notice:
        </button>
        {modal ? (
          <>
            <div className="modal-backdrop fade show"></div>
            <div
              className={`modal fade ${modal ? "show d-block" : ""}`}
              id="Send_Notice"
              tabIndex={-1}
              role="dialog"
              data-testid="postModal"
            >
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
              >
                <div className="modal-content dark-bg">
                  <div className="modal-header white-txt">
                    <h5 className="modal-title " id="exampleModalLongTitle">
                      Enter information into the form below:
                    </h5>
                    <button
                      type="button"
                      className="close"
                      onClick={() => setModal(false)}
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
                        className="white-txt"
                        data-testid="Image"
                        onChange={(e) => uploadImage(e)}
                      />
                      <h1 className="titletxt">Title</h1>
                      <InputForm
                        img={null}
                        onChange={OnChangeForm}
                        name="title"
                        value={inputs.title}
                        type="text"
                        placeholder="Enter title here (required):"
                        min={1}
                        max={50}
                        data-testid="title"
                      />
                      <h1 className="titletxt">Description</h1>
                      <LargeInputForm
                        onChange={OnChangeForm}
                        name="message"
                        value={inputs.message}
                        placeholder="Enter description here (max 1000 characters):"
                        rows={3}
                        cols={40}
                        maxTxtSize={1000}
                        data-testid="Description"
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
                          <option value="Master's degree">
                            Master's degree
                          </option>
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
                          data-testid="YearSign"
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
                            data-testid="workYearBound1"
                            min={0}
                            max={100}
                          />
                          <InputForm
                            img={null}
                            onChange={OnChangeForm}
                            name="work_years_boundary"
                            value={inputs.work_years_boundary}
                            type="number"
                            placeholder="Second Value"
                            data-testid="workYearBound2"
                            min={0}
                            max={100}
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
                          data-testid="workYear"
                          min={0}
                          max={100}
                        />
                      )}

                      <h1 className="titletxt">Skills</h1>
                      <SkillsType
                        defaultValue={inputs.skills_description}
                        onChange={OnChangeFormSkills}
                        minHeightItems={4}
                      />
                      <h1 className="titletxt">Expiry Date</h1>
                      <input
                        type="date"
                        name="date"
                        data-testid="dateInput"
                        min={new Date().toISOString().split("T")[0]}
                        className="form-control my-3"
                        onChange={OnChangeForm}
                      />
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setModal(false)}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={submitPostForm}
                      data-dismiss="modal"
                      data-testid="postNoticeBtn"
                    >
                      Post Notice
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </>
    );
  };
  return (
    <>
      <div>{renderPostNotices()}</div>
      {notices.length > 0 ? (
        <>
          <div className="board-container">
            {isFiltered
              ? renderNotices(personalNotices)
              : renderNotices(notices)}
          </div>
        </>
      ) : (
        <div className="board-container">
          <h1 className="white-txt gap-top">Nothing to see here..</h1>
        </div>
      )}
    </>
  );
}
