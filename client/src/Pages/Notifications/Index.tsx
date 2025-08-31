import React,{ useEffect,useState } from "react"

import { useNavigate } from "react-router-dom";
//Components/Styles
import Dock from "../universal_components/Dock";
import DashbordBtn from "../Dashboard/components/LinktoPgBtn";
import NotificationComponent from "./components/Notification";
//Routes/Functions
import { ReturnUserNotifs } from "./components/functions/NotificationRoutes"
//Assets
import dashboardimg from "../universal_components/universal_assets/dashboard.svg";
import { Notification } from "./components/functions/NotificationRoutes";


export default function NotifPage(){
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState(null);
    const items = [
        {
          icon: <DashbordBtn size={50} img_path={dashboardimg} />,
          label: "Back To Dashboard",
          onClick: () => navigate("/dashboard"),
        },
      ];
    useEffect(() => {
        const fetchNotifs = async () => {
          const notifs = await ReturnUserNotifs();
          setNotifications(notifs)
        };
        fetchNotifs();
      }, []) 
    return(
        <>
        <div className="top-bar">
        <Dock
          items={items}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
        
        
      </div>
      <div>
      {
            notifications===null?<p>Loading....</p>:notifications.map((notification)=>(
                <NotificationComponent {...notification}></NotificationComponent>
            ))
        }
      </div>
      </>
    )
}