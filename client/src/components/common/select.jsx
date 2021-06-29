import React from "react";
import { InputGroup, Form, Alert } from "react-bootstrap";

const Select = ({ name, label, options, errors, ...otherProps }) => {
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
          {...otherProps}
        >
          <option value="" />
          {options.map((option) => (
            <option key={option._id} value={option._id}>
              {option.name}
            </option>
          ))}
        </Form.Control>
      </InputGroup>
      {errors[name] && <Alert variant="danger">{errors[name]}</Alert>}
    </Form.Group>
  );
};

export default Select;
