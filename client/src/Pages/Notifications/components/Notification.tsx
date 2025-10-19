import React, { useEffect, useState, useCallback } from "react";
import { Modal, Button } from "react-bootstrap";
import { Notification } from "./functions/NotificationRoutes";
import {
  UpdateUserNotifs,
  ReturnUserNotifsByID,
} from "./functions/NotificationRoutes";
import { toast } from "react-toastify";
import LargeInputForm from "../../Profile/components/LargeInpForm";
import { SendNotification } from "./functions/NotificationRoutes";
import { returnUserInfoByID } from "../../Profile/components/functions/ProfileRoutes";
import { Grad } from "../../Dashboard/components/NoticeBoardGraduate";
import "../Index.css";
import returnThing from "../../universal_components/universal_assets/returnBack.svg";
import returnThingHovered from "../../universal_components/universal_assets/returnBackHovered.svg";
interface User {
  email: string;
  id: string;
  isgrad: boolean;
  phone_number: string;
}

interface UserEmployer {
  bio: string;
  company_name: string;
  employer_id: string;
  id: string;
  isVerified: boolean;
}

export default function NotificationComponent(notification: Notification) {
  const defaultUser: User = {
    email: "",
    id: "",
    isgrad: true,
    phone_number: "",
  };
  const defaultGrad: Grad = {
    first_name: "",
    middle_name: "",
    last_name: "",
    age: 0,
    id: "",
    attended_uni: [],
    skills_desc: [],
    bio_description: "",
    degree_type: "",
    work_years: 0,
  };
  const [msg, setMsg] = useState("");
  const OnChangeMsg = (e: any) => setMsg(e.target.value);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRead, setIsRead] = useState<boolean>(false);
  const [imgHovered, setImgHovered] = useState<boolean>(false);
  const [sender, setSender] = useState<[User, UserEmployer | Grad]>([
    defaultUser,
    defaultGrad,
  ]);
  const onReadChange = async () =>
    await UpdateUserNotifs(notification.notif_id);
  useEffect(() => {
    const fetchNotif = async () => {
      const notif = await ReturnUserNotifsByID(notification.notif_id);
      const userInfo = await returnUserInfoByID(notification.sender_id);
      setSender(userInfo);
      console.log(userInfo);
      setIsRead(notif[0].is_read);
    };
    fetchNotif();
  }, []);
  const SendMessage = async (id: string, message: string) => {
    console.log(id, message);
    await SendNotification(id, message);
    toast.success("Sending message");
  };
  return (
    <>
      {isRead === true ? (
        <></>
      ) : (
        <>
          <div className="notif-container">
            <div className="notif-header">
              From{" "}
              {sender[0].isgrad
                ? `${
                    (sender[1] as Grad).first_name
                      ? `${(sender[1] as Grad).first_name} ${
                          (sender[1] as Grad).middle_name
                        } ${(sender[1] as Grad).last_name}`
                      : "Anonymous User"
                  }`
                : `${(sender[1] as UserEmployer).company_name}`}
              :
            </div>
            <div className="notif-msg">{notification.message}</div>
            <div className="side-by-side">
              <img
                src={!imgHovered ? returnThing : returnThingHovered}
                onClick={() => setIsModalOpen(true)}
                onMouseEnter={() => setImgHovered(true)}
                onMouseLeave={() => setImgHovered(false)}
                className="notif-img-container"
                style={{ cursor: "pointer" }}
              />
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="flexCheckDefault"
                  onChange={onReadChange}
                />
                <label htmlFor="flexCheckDefault">Mark as read</label>
              </div>
            </div>

            <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
              <Modal.Header>
                <Modal.Title>
                  Message{" "}
                  {sender[0].isgrad
                    ? sender[1].first_name
                    : sender[1].company_name}
                  :
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <LargeInputForm
                  onChange={OnChangeMsg}
                  name="bio_description"
                  value={msg}
                  placeholder={`Write to ${
                    sender[0].isgrad
                      ? sender[1].first_name
                      : sender[1].company_name
                  } (400 chars max)`}
                  rows={5}
                  cols={10}
                  maxTxtSize={1000}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </Button>
                <Button
                  variant="success"
                  onClick={async () => {
                    const recipientId =
                      sender[0].id || (sender[1] as Grad | UserEmployer).id;

                    await SendMessage(recipientId, msg);
                    setIsModalOpen(false);
                    setMsg(""); // clear input
                  }}
                >
                  Send message
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </>
      )}
    </>
  );
}
