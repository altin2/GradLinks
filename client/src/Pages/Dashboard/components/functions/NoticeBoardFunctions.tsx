import supabase from "../../../../supabase-Client";
import { toast } from "react-toastify";
//Function names are self-explanatory

export async function PostNotice(
  message: string,
  required_degree: string,
  required_skills: string[],
  required_work: string,
  Title: string,
  date: Date,
  img?: any
) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const { data } = await supabase
      .from("user_employer")
      .select("isVerified")
      .eq("id", session?.user.id);
    const body = {
      message,
      required_degree,
      required_skills,
      required_work,
      Title,
      date,
      verified: data?.[0]?.isVerified,
    };
    //routing to server
    const res = await fetch("http://localhost:5000/notices/uploadnotice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify(body),
    });
    const result = await res.json();
    //Profile change done on frontend for lower latency
    if (result.success && img) {
      const { error } = await supabase.storage
        .from("user_post_images")
        .upload(`/Public/${result.noticeID}`, img, {
          cacheControl: "3600",
          upsert: false,
        });
      if (error) console.error(error.message);
    }
  } catch (err: any) {
    console.error(err.message);
  }
}

export async function RetrieveRelevantNotices(
  WorkParam?: number,
  SkillsParam?: string[],
  DegreeParam?: string
) {
  try {
    const body = { WorkParam, SkillsParam, DegreeParam };
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const res = await fetch(
      "http://localhost:5000/notices/returnrelevantnotices",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(body),
      }
    );
    const parseRes = res.json();

    return parseRes;
  } catch (err) {
    console.error(err.message);
  }
}

export async function RetrieveRandomNotices() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const res = await fetch(
      "http://localhost:5000/notices/returnrandomnotices",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      }
    );
    const parseRes = res.json();

    return parseRes;
  } catch (err: any) {
    console.error(err.message);
  }
}
export async function RetrievePersonalNotices() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const res = await fetch(
      "http://localhost:5000/notices/returnpersonalnotices",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      }
    );
    const parseRes = res.json();

    return parseRes;
  } catch (err: any) {
    console.error(err.message);
  }
}
