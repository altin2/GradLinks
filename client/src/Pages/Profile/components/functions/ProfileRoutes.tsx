//checks to see what bio options profile should display
import supabase from "../../../../supabase-client";
export async function returnGradStatus(){
    try {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch("http://localhost:5000/profile/returngradstatus", {
            method: "GET",
            headers: { Authorization: `Bearer ${session?.access_token}` },
          });
          const parseData = await res.json();
        return parseData
    } catch (err) {
        console.error(err.message);
    }
}
//returns grad information by ID
export async function returnGradInfo(){
    try {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch("http://localhost:5000/profile/returngradinfo", {
            method: "GET",
            headers: { Authorization: `Bearer ${session?.access_token}` },
          });
          const parseData = await res.json();
        return parseData
    } catch (err) {
        console.error(err.message);
    }
}
//updates grad info by ID and current JWT
export async function updateGradInfo(body){
    try {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch("http://localhost:5000/profile/updategradinfo", {
            method: "POST",
            headers: { "Content-Type": "application/json",Authorization: `Bearer ${session?.access_token}` },
            body: JSON.stringify(body),
          });
          const parseData = await res.json();
        return parseData
    } catch (err) {
        console.error(err.message);
    }
}


//returns employer information by ID
export async function returnEmpInfo(){
    try {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch("http://localhost:5000/profile/returnempinfo", {
            method: "GET",
            headers: { Authorization: `Bearer ${session?.access_token}` },
          });
          const parseData = await res.json();
        return parseData
    } catch (err) {
        console.error(err.message);
    }
}
//updates employer info by ID and current JWT
export async function updateEmpInfo(body){
    try {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch("http://localhost:5000/profile/updateempinfo", {
            method: "POST",
            headers: { "Content-Type": "application/json",Authorization: `Bearer ${session?.access_token}` },
            body: JSON.stringify(body),
          });
          const parseData = await res.json();
        return parseData
    } catch (err) {
        console.error(err.message);
    }
}