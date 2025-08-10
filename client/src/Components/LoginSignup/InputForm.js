import "./FormStyle.css"
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import React from "react";

const InputForm = ({ img, onChange, name, value, type, placeholder }) => {
    const handlePhoneChange = (phoneValue) => {
        // Create a synthetic event object that matches the expected format
        const syntheticEvent = {
            target: {
                name: name,
                value: phoneValue
            }
        };
        onChange(syntheticEvent);
    };

    return (
        <div className="input">
            {img && <img src={img} alt="" />}
            {name === "phonenumber" ? (
                <PhoneInput 
                    country={"us"} 
                    type={type} 
                    name={name} 
                    value={value} 
                    onChange={handlePhoneChange}
                    placeholder={placeholder}
                />
            ) : (
                <input 
                    type={type} 
                    name={name} 
                    value={value} 
                    onChange={onChange}
                    placeholder={placeholder}
                    className="form-control my-3"
                />
            )}
        </div>
    );
}

export default InputForm;