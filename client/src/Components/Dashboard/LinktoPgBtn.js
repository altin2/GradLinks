import React from "react"
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
const LinktoPgBtn =({func,btnStyle,text}) =>{
    return(
    <button onClick={func} className={btnStyle}>
        {text}
      </button>)
}
export default LinktoPgBtn