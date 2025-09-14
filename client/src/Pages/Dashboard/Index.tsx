//Package features and stuff
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabase-client.js";
//Components
import TextType from "./components/TextType.js";
import DashbordBtn from "./components/LinktoPgBtn.js";
import Dock from "../universal_components/Dock.js";
import { NoticeBoardGrad } from "./components/NoticeBoardGraduate.tsx";
import { NoticeBoardEmployer } from "./components/NoticeBoardEmployer.tsx";
import NotifPage from "../Notifications/Index.tsx";
//Assets
import emptypfp from "../universal_components/universal_assets/emptypfp.svg";
import logoutimg from "../universal_components/universal_assets/logout.svg";
import notifempty from "../universal_components/universal_assets/notification.svg";
import notifcontains from "../universal_components/universal_assets/notificationFull.svg";
import searchTalent from "../universal_components/universal_assets/searchTalent.svg";
//Styles and routes
import "./Index.css";
import { getProfile, logout } from "../../functions/routes.tsx";
import { ReturnUserNotifs } from "../Notifications/components/functions/NotificationRoutes.tsx";
import { returnGradStatus } from "../Profile/components/functions/ProfileRoutes.tsx";
const Dashboard = ({ setAuth }) => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [notifLen, setNotifLen] = useState(0);
  const [gradStatus, setGradStatus] = useState(null);
  const [pfpUrl, setPfpUrl] = useState<any>(null);
  const fetchPFP = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const { data } = supabase.storage
      .from("user_pfps")
      .getPublicUrl(`Public/${session?.user.id}`);
    if (data) {
      console.log(data.publicUrl);
      return data.publicUrl;
    } else {
      return null;
    }
  };
  const items = [
    {
      icon: <DashbordBtn size={50} img_path={logoutimg} />,
      label: "Logout",
      onClick: () => logout(),
    },
    {
      icon: <DashbordBtn size={50} img_path={pfpUrl} />,
      label: "Profile",
      onClick: () => navigate("/profile"),
    },
    // {
    //   icon: (
    //     <DashbordBtn
    //       size={60}
    //       img_path={
    //         notifLen > 0 && notifLen !== null ? notifcontains : notifempty
    //       }
    //     />
    //   ),
    //   label: `${notifLen} unread ${
    //     notifLen > 1 ? "notifications" : "notification"
    //   } `,
    //   onClick: () => navigate("/notifications"),
    // },
    ...(gradStatus === false
      ? [
          {
            icon: <DashbordBtn size={50} img_path={searchTalent} />,
            label: "Find some talent",
            onClick: () => navigate("/search_talent"),
          },
        ]
      : []),
  ];
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileName = await getProfile();
        const notifs = await ReturnUserNotifs();
        setNotifLen(notifs.length);
        setName(profileName);
        const newUrl = fetchPFP().then((res) => setPfpUrl(res)); //fetching profile picture once
      } catch (err) {
        console.error("Error fetching profile:", err);
        toast.error("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchGradStatus = async () => {
      const profileName = await returnGradStatus();
      setGradStatus(profileName);
    };
    fetchGradStatus();
  }, []);

  return (
    <>
      <div className="top-bar">
        <div>
          <TextType
            text={[`Welcome ${name}`]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
          />
          <Dock
            items={items}
            panelHeight={68}
            baseItemSize={50}
            magnification={70}
          />
        </div>
      </div>
      {/* <NotifPage /> */}
      <div>
        {gradStatus === null ? (
          <div>Loading...</div>
        ) : gradStatus ? (
          <NoticeBoardGrad />
        ) : (
          <NoticeBoardEmployer />
        )}
      </div>
    </>
  );
};

export default Dashboard;
