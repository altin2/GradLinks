import React,{ useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom";
import { Notification } from "./functions/NotificationRoutes";
import { UpdateUserNotifs,ReturnUserNotifsByID } from "./functions/NotificationRoutes";
import "../Index.css"
export default function NotificationComponent(notification: Notification){
    const [isRead,setIsRead]=useState(null)
    const onReadChange= async ()=> await UpdateUserNotifs(notification.notif_id)
    useEffect(() => {
        const fetchNotif = async () => {
            const notif = await ReturnUserNotifsByID(notification.notif_id)
            setIsRead(notif[0].is_read)
          };
          fetchNotif();
      }, []) 
    return(
        <>
        {isRead===null?<p1></p1>:
        <div className="notifBackground" onChange={onReadChange}>
            <h5>{notification.message}</h5> 
            <hr/>
            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" defaultChecked={isRead?"checked":null}/>
  <label className="form-check-label" htmlFor="flexRadioDefault1">
    Mark as read
  </label>
        </div>
}
        </>
    )
}