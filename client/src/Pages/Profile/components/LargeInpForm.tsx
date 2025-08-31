import React from "react";
import "./FormStyle.css"

const LargeInputForm = ({ onChange,name, value, placeholder,rows,cols }) => {
    return (
        <div className="input">
            <textarea rows={rows} 
            cols={cols} 
            name={name} 
            value={value} 
            onChange={onChange}
            placeholder={placeholder}
            className="form-control my-3"
            >{value}</textarea>

        </div>
    );
}

export default LargeInputForm;