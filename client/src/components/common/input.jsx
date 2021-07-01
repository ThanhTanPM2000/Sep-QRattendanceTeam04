import React from "react";
import { InputGroup, Form, Alert } from "react-bootstrap";

const Input = ({ name, label, errors, ...otherProps }) => {
  return (
    <Form.Group>
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text id={name}>{label}</InputGroup.Text>
        </InputGroup.Prepend>
        {/* <Form.Label htmlFor={name}>{label}</Form.Label> */}
        <Form.Control
          autoComplete="off"
          name={name}
          id={name}
          aria-describedby={name}
          {...otherProps}
        />
      </InputGroup>
      {errors[name] && <Alert variant="danger">{errors[name]}</Alert>}
    </Form.Group>
  );
};

export default Input;
