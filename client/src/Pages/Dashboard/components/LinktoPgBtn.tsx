import React from "react"

const LinktoPgBtn =({func,btnStyle,text}) =>{
    return(
    <button onClick={func} className={btnStyle}>
        {text}
      </button>)
    
}
export default LinktoPgBtn