import supabase from "../../../../supabase-Client";
export interface Notification {
  message: string;
  user_id: string;
  notif_id: string;
  is_read: boolean;
  created_at: Date;
  sender_id: string;
}
export async function ReturnUserNotifs(): Promise<Notification[]> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const res = await fetch(
      "http://localhost:5000/dashboard/recievenotification",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${session?.access_token}` },
      }
    );
    const parseData: Array<Notification> = await res.json();
    if (!res.ok)
      throw new Error(`Failed to fetch notifications: ${res.status}`);
    //only returns unread notifications
    const newData = parseData.filter((val) => {
      return val.is_read === false;
    });

    return newData;
  } catch (err: any) {
    console.error(err.message);
    return [];
  }
}
export async function ReturnUserNotifsByID(
  notif_id: string
): Promise<Notification[]> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const body = { notif_id };

    const res = await fetch(
      "http://localhost:5000/dashboard/recievenotificationbyID",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(body),
      }
    );
    const parseData: Array<Notification> = await res.json();
    if (!res.ok) {
      throw new Error(`Failed to update notif: ${res.status}`);
    }
    return parseData;
  } catch (err: any) {
    console.error(err.message);
    return [];
  }
}
export async function UpdateUserNotifs(notif_id: string) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const body = { notif_id };

    const res = await fetch(
      "http://localhost:5000/dashboard/updatenotification",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(body),
      }
    );
    if (!res.ok) {
      throw new Error(`Failed to update notif: ${res.status}`);
    }
    return res.ok;
  } catch (err: any) {
    console.error(err.message);
  }
}
export async function SendNotification(reciever_id: string, message: string) {
  try {
    const body = { recieverID: reciever_id, message: message };

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const res = await fetch(
      "http://localhost:5000/dashboard/sendnotification",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(body),
      }
    );
    if (!res.ok) {
      throw new Error(`Failed to update notif: ${res.status}`);
    }
  } catch (err: any) {
    console.error(err.message);
  }
}
