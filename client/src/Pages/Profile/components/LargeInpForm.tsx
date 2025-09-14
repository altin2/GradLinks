import React from "react";
import "./FormStyle.css";
type LargeInputFormProps = {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  name: string;
  value: string;
  placeholder?: string;
  rows?: number;
  cols?: number;
  maxTxtSize?: number;
};
export default function LargeInputForm({
  onChange,
  name,
  value,
  placeholder,
  rows,
  cols,
  maxTxtSize,
}: LargeInputFormProps) {
  return (
    <div className="input">
      <textarea
        rows={rows}
        cols={cols}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="form-control my-3"
        maxLength={maxTxtSize}
      >
        {value}
      </textarea>
    </div>
  );
}
