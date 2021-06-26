import React from "react";
import { Form, Alert } from "react-bootstrap";

const Input = ({ name, label, errors, ...otherProps }) => {
  return (
    <Form.Group>
      {/* <Form.Label htmlFor={name}>{label}</Form.Label> */}
      <label htmlFor={name}>{label}</label>
      <Form.Control name={name} id={name} {...otherProps} />
      {errors[name] && <Alert variant="danger">{errors[name]}</Alert>}
    </Form.Group>
  );
};

export default Input;
