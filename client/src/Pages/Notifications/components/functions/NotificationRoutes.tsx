import supabase from "../../../../supabase-client";
export interface Notification {
    message: string,
    user_id:string,
    notif_id:string,
    is_read:boolean,
    created_at:Date
  }
export async function ReturnUserNotifs():Promise<Notification[]>{
    try {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch("http://localhost:5000/dashboard/recievenotification", {
            method: "GET",
            headers: { Authorization: `Bearer ${session?.access_token}` },
          });
          const parseData: Array<Notification> = await res.json();
          if (!res.ok) throw new Error(`Failed to fetch notifications: ${res.status}`);
        return parseData
    } catch (err) {
        console.error(err.message);
        return []
    }
}
export async function ReturnUserNotifsByID(notif_id:string):Promise<Notification[]>{
  try {
    const body = {notif_id}

    const res = await fetch("http://localhost:5000/dashboard/recievenotificationbyID", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const parseData: Array<Notification> = await res.json()
      if (!res.ok) {
        throw new Error(`Failed to update notif: ${res.status}`);
      }
      return parseData
  } catch (err) {
      console.error(err.message);
      return []
  }
}
export async function UpdateUserNotifs(notif_id:string ){
  try {
      const body = {notif_id}

      const res = await fetch("http://localhost:5000/dashboard/updatenotification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          throw new Error(`Failed to update notif: ${res.status}`);
        }
        return res.ok
  } catch (err) {
      console.error(err.message);
  }
}