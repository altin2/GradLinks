import supabase from "../../../../supabase-client";

export async function RelevanceAlgorithm(
  WorkParam?: string,
  SkillsParam?: string[],
  DegreeParam?: string[],
  UniParam?: string[]
) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const body = { WorkParam, SkillParam: SkillsParam, DegreeParam, UniParam };
    const res = await fetch("http://localhost:5000/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const parseData = await res.json();
    return parseData;
  } catch (err: any) {
    console.error(err.message);
  }
}
