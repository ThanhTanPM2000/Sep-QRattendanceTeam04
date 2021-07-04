import React from "react";
import { InputGroup, Form, Alert } from "react-bootstrap";

const Select = ({
  name,
  label,
  options,
  errors,
  value,
  propDisplay,
  isReadOnly,
  ...otherProps
}) => {
  return (
    <Form.Group>
      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text id="name">{label}</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          as="select"
          name={name}
          aria-describedby={name}
          id={name}
          value={value}
          {...otherProps}
        >
          {options.map((option) => (
            <option
              disabled={option._id !== value && isReadOnly}
              key={option._id}
              value={option._id}
            >
              {option[propDisplay]}
            </option>
          ))}
        </Form.Control>
      </InputGroup>
      {errors[name] && <Alert variant="danger">{errors[name]}</Alert>}
    </Form.Group>
  );
};

export default Select;
