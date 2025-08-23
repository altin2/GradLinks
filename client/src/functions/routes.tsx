
import { toast } from "react-toastify";
//logs user out
export function logout() {
    try {
      localStorage.clear();
      window.location.reload();
      toast.success("Logout successful");
    } catch (err) {
      console.error(err);
    }
  }

  
//returns email for the dashboard 
export async function getProfile() {
    try {
      const res = await fetch("http://localhost:5000/dashboard", {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.access_token}` },
      });
      //only returns email or nothing
      const parseData = await res.json();
  
      if (parseData === "session over") {
        logout();
        return ""
      } else if (parseData === "null") {
        return ""
      } else {
        return parseData;
      }
    } catch (err) {
      console.error(err.message);
      logout();
      return ""; 
    }
  }
//for signup pg
export function passCheck(password:string){
    if (password.length === 0) {
        toast.error("Cannot leave password blank");
       return false;
      } else {
        if (password.length < 7) {
          toast.error("Pass must be more than 7 characters");
         return false;
        }
        if (![...password].some((char) => /[A-Z]/.test(char))) {
          toast.error("Pass must contain at least 1 uppercase letter");
         return false;
        }
        if (![...password].some((char) => /[a-z]/.test(char))) {
          toast.error("Pass must contain at least 1 lowercase letter");
         return false;
        }
        if (![...password].some((char) =>/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(char))) {
          toast.error("Pass must contain at least 1 special symbol");
         return false;
        }
      }
    return true
}
//checks to see what bio options profile should display
export async function returnGradStatus(){
    try {
        const res = await fetch("http://localhost:5000/profile", {
            method: "GET",
            headers: { Authorization: `Bearer ${localStorage.access_token}` },
          });
          const parseData = await res.json();
        return parseData
    } catch (err) {
        console.error(err.message);
    }
}
  