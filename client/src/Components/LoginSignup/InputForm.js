import "./FormStyle.css"

const InputForm = ({ img, onChange, name, value, type, placeholder }) => {
    return (
        <div className="input">
            {img && <img src={img} alt="" />}
            <input type={type} name={name} value={value} onChange={onChange}placeholder={placeholder}className="form-control my-3"/>
        </div>
    );
}

export default InputForm;