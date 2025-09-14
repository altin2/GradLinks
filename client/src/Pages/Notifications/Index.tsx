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
  useEffect(() => {
    const fetchNotifs = async () => {
      const notifs = await ReturnUserNotifs();
      setNotifications(notifs);
    };
    fetchNotifs();
  }, []);
  return (
    <><RevealNotifButton>
        
        {notifications === null ? (
          <p>Loading....</p>
        ) : (
          notifications.map((notification) => (
            <NotificationComponent {...notification} />
          ))
        )}
        
      </RevealNotifButton>
    </>
  );
}
function RevealNotifButton({ children }: RevealButtonProps) {
  const [revealed, setRevealed] = useState(false)

  const toggleReveal = () => setRevealed(!revealed)

  return (
    <div className="notif-reveal-container">
  
  <button
    id={revealed ? "reveal-notif-btn-bottom" : "reveal-notif-btn"}
    onClick={toggleReveal}
  >
    {revealed ? "↑" : "↓"}
  </button>
  <div className={`notif-container reveal-content ${revealed?"show":""}`}>
    {children}
  </div>
</div>


  )
}