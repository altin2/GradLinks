import "./FormStyle.css";
import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
interface InputProps {
  img: any;
  onChange: any;
  name: string;
  value: any;
  type?: string;
  placeholder: string;
  className?: string;
  small?: boolean;
  min?: number;
  max?: number;
  "data-testid"?: string;
}
const InputForm = ({
  img,
  onChange,
  name,
  value,
  type,
  placeholder,
  className,
  small,
  min,
  max,
  "data-testid": dataTestId,
}: InputProps) => {
  return (
    <div className={small !== null && small === true ? "input-2" : "input"}>
      {img && <img src={img} alt="" />}
      {name === "phonenumber" ? (
        <PhoneInput
          name={name}
          value={value}
          onChange={(phonenum) =>
            onChange({ target: { name, value: phonenum } })
          }
          placeholder={placeholder}
          country="us"
          data-testid={dataTestId}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={className ? className : "form-control my-3"}
          maxLength={max ? max : 60}
          min={min}
          data-testid={dataTestId}
          max={type === "number" ? max : undefined}
        />
      )}
    </div>
  );
};

export default InputForm;
