import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Notification } from "./functions/NotificationRoutes";
import {
  UpdateUserNotifs,
  ReturnUserNotifsByID,
} from "./functions/NotificationRoutes";
import "../Index.css";
export default function NotificationComponent(notification: Notification) {
  const [isRead, setIsRead] = useState<boolean>(false);
  const onReadChange = async () =>
    await UpdateUserNotifs(notification.notif_id);
  useEffect(() => {
    const fetchNotif = async () => {
      const notif = await ReturnUserNotifsByID(notification.notif_id);
      setIsRead(notif[0].is_read);
    };
    fetchNotif();
  }, []);
  return (
    <>
      {isRead === true ? (
        <></>
      ) : (
        <div className="notifBackground" onChange={onReadChange}>
          <h5>{notification.message}</h5>
          <hr />
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              value=""
              id="flexCheckDefault"
            />
            <label
              className="form-check-label"
              htmlFor="flexCheckDefault"
              defaultChecked={isRead}
            >
              Mark as read (WILL NOT SHOW UP AGAIN)
            </label>
          </div>
        </div>
      )}
    </>
  );
}
