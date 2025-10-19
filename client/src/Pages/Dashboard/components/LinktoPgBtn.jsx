import React from "react"


const DashbordBtn =({size,img_path, ...rest}) =>{
    return(
    <img src={img_path} alt="dashboard component" width={size} height={size}{...rest}/>)
    
}


export default (DashbordBtn)