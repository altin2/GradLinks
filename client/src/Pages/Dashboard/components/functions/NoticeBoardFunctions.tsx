import supabase from "../../../../supabase-client";
import { toast } from "react-toastify";
export async function PostNotice(
  message: string,
  required_degree: string,
  required_skills: string[],
  required_work: string,
  Title: string,
  img?: any
) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const body = {
      message,
      required_degree,
      required_skills,
      required_work,
      Title,
    };

    const res = await fetch("http://localhost:5000/notices/uploadnotice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify(body),
    });
    const result = await res.json();
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
    const res = await fetch(
      "http://localhost:5000/notices/returnrelevantnotices",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
    const res = await fetch(
      "http://localhost:5000/notices/returnrandomnotices",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const parseRes = res.json();

    return parseRes;
  } catch (err) {
    console.error(err.message);
  }
}
