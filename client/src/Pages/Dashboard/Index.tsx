//Package features and stuff
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabase-Client.js";
//Components
import TextType from "./components/TextType.jsx";
import DashbordBtn from "./components/LinktoPgBtn.jsx";
import Dock from "../universal_components/Dock.jsx";
import { NoticeBoardGrad } from "./components/NoticeBoardGraduate.tsx";
import { NoticeBoardEmployer } from "./components/NoticeBoardEmployer.tsx";
import NotifPage from "../Notifications/Index.tsx";
import Profile from "../Profile/Index.tsx";
//Assets
import logoutimg from "../universal_components/universal_assets/logout.svg";
import searchTalent from "../universal_components/universal_assets/searchTalent.svg";
//Styles and routes
import "./Index.css";
import { getProfile, logout } from "../../functions/Routes.tsx";
import { ReturnUserNotifs } from "../Notifications/components/functions/NotificationRoutes.tsx";
import { returnGradStatus } from "../Profile/components/functions/ProfileRoutes.tsx";
import DarkVeil from "../universal_components/DarkVeil.tsx";
import { useAuthStatus } from "../Profile/components/functions/ProfileRoutes.tsx";
const Dashboard = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [notifLen, setNotifLen] = useState(0);
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [gradStatus, setGradStatus] = useState(null);
  const [pfpUrl, setPfpUrl] = useState<any>(null);
  //For testing only:
  const { isAuthenticated, user } = useAuthStatus();

  const fetchPFP = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const { data } = supabase.storage
      .from("user_pfps")
      .getPublicUrl(`Public/${session?.user.id}`);
    if (data) {
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
  //Fixes scrolling issue.
  const controlNavbar = () => {
    if (window.scrollY > lastScrollY) {
      setShow(false);
    } else {
      setShow(true);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        //Loading all user's data upon login, like notifications, profile data, and notices.
        const profileName = await getProfile();
        const notifs = await ReturnUserNotifs();
        setNotifLen(notifs.length);
        setName(profileName);
        const newUrl = await fetchPFP();
        setPfpUrl(newUrl);
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
      setGradStatus(profileName.isgrad);
    };
    fetchGradStatus();
  }, []);

  return (
    <>
      <div className="bg-div">
        <DarkVeil />
      </div>
      <div className="top-left">
        <TextType
          text={[`Welcome ${name}`]}
          typingSpeed={75}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="|"
          textColors={["white"]}
        />
      </div>

      <div className={`bar-top ${show ? "bar-top-visible" : "bar-top-hidden"}`}>
        <Dock
          items={items}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
          data-testid={items.length > 1 ? "dock-find-talent" : ""}
        />
      </div>
      <NotifPage />
      <div>
        <Profile url={pfpUrl} />
      </div>
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
