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
  small?: boolean;
  "data-testid"?: string;
};
export default function LargeInputForm({
  onChange,
  name,
  value,
  placeholder,
  rows,
  cols,
  maxTxtSize,
  small,
  "data-testid": dataTestId,
}: LargeInputFormProps) {
  return (
    <div className={small !== null && small === true ? "input-3" : "input"}>
      <textarea
        rows={rows}
        cols={cols}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="form-control my-3"
        maxLength={maxTxtSize}
        data-testid={dataTestId}
      >
        {value}
      </textarea>
    </div>
  );
}
