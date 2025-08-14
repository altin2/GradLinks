import "./FormStyle.css"

import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const InputForm = ({ img, onChange, name, value, type, placeholder }) => {
    return (
        <div className="input">
            {img && <img src={img} alt="" />}
            {name==="phonenumber"?
            <PhoneInput name={name}value={value}onChange={(phonenum) => onChange({ target: { name, value: phonenum } })}placeholder={placeholder}country="us"/>:
            <input type={type} name={name} value={value} onChange={onChange}placeholder={placeholder}className="form-control my-3"/>}

            
        </div>
    );
}

export default InputForm;