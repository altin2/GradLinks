import React, { useEffect, useState } from "react";
import { RevealButtonProps } from "../Dashboard/components/NoticeBoardGraduate";
import { useNavigate } from "react-router-dom";
//Components/Styles
import NotificationComponent from "./components/Notification";
//Routes/Functions
import { ReturnUserNotifs } from "./components/functions/NotificationRoutes";
//Assets
import { Notification } from "./components/functions/NotificationRoutes";

export default function NotifPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isHidden, setIsHidden] = useState<boolean>(false);
  useEffect(() => {
    const fetchNotifs = async () => {
      const notifs = await ReturnUserNotifs();
      setNotifications(notifs);
    };
    fetchNotifs();
  }, []);
  const toggleShow = () => {
    setIsHidden(!isHidden);
  };

  return (
    <>
      <div className="show-btn" onClick={toggleShow}>
        {isHidden ? "Show" : "Hide"}
      </div>
      {isHidden ? (
        <></>
      ) : (
        <div className="notif-big-container">
          Notifications:
          {notifications === null ? (
            <p>Loading....</p>
          ) : (
            notifications.map((notification) => (
              <NotificationComponent {...notification} />
            ))
          )}
        </div>
      )}
    </>
  );
}
