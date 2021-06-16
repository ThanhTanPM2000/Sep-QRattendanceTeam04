import React from "react";

const Input = ({ name, label, errors, ...otherProps }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input className="form-control" name={name} id={name} {...otherProps} />
      {errors[name] && <div className="alert alert-danger">{errors[name]}</div>}
    </div>
  );
};

export default Input;
