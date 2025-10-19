import supabase from "../../../supabase-Client";

export async function returnBioInfo() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const res = await fetch("http://localhost:5000/bio/returnbioinfo", {
      method: "GET",
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    const parseData = await res.json();
    return parseData;
  } catch (err: any) {
    console.error(err.message);
  }
}
export async function updateBioInfo(body: any) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const res = await fetch("http://localhost:5000/bio/updatebioinfo", {
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
