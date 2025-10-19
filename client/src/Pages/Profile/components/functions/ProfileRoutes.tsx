//checks to see what bio options profile should display
import { useEffect, useState } from "react";
import supabase from "../../../../supabase-Client";
export async function returnGradStatus() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const res = await fetch("http://localhost:5000/profile/returngradstatus", {
      method: "GET",
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    const parseData = await res.json();

    return parseData;
  } catch (err: any) {
    console.error(err.message);
  }
}
//returns grad information by ID
export async function returnGradInfo() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const res = await fetch("http://localhost:5000/profile/returngradinfo", {
      method: "GET",
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    const parseData = await res.json();
    return parseData;
  } catch (err: any) {
    console.error(err.message);
  }
}
//updates grad info by ID and current JWT
export async function updateGradInfo(body: any) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const res = await fetch("http://localhost:5000/profile/updategradinfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify(body),
    });
    const parseData = await res.json();
    return parseData;
  } catch (err: any) {
    console.error(err.message);
  }
}
//Allows people to update their profile picture
export async function updateProfile(img: any) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { error } = await supabase.storage
    .from("user_pfps")
    .upload(`Public/${session?.user.id}`, img, {
      cacheControl: "3600",
      upsert: true,
    });
  if (error) console.error(error.message);
}
//returns employer information by ID
export async function returnEmpInfo() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const res = await fetch("http://localhost:5000/profile/returnempinfo", {
      method: "GET",
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    const parseData = await res.json();
    return parseData;
  } catch (err: any) {
    console.error(err.message);
  }
}
//updates employer info by ID and current JWT
export async function updateEmpInfo(body: any) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const res = await fetch("http://localhost:5000/profile/updateempinfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify(body),
    });
    const parseData = await res.json();
    return parseData;
  } catch (err: any) {
    console.error(err.message);
  }
}

export async function returnUserInfoByID(id: string) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const body = { id };
    const res = await fetch("http://localhost:5000/profile/returnuserinfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify(body),
    });
    const parseData = await res.json();
    return parseData;
  } catch (err: any) {
    console.error(err.message);
  }
}

export const useAuthStatus = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check immediately on mount
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setUser(session?.user ?? null);
    };
    checkSession();

    // Listen for login/logout changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session);
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return { isAuthenticated, user };
};
