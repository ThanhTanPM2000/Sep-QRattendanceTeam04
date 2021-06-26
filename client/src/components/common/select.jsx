import React from "react";
import { Form, Alert } from "react-bootstrap";

const Select = ({ name, label, options, error, ...otherProps }) => {
  return (
    <Form.Group>
      <Form.Label htmlFor={name}>{label}</Form.Label>
      <Form.Control as="select" name={name} id={name} {...otherProps}>
        <option value="" />
        {options.map((option) => (
          <option key={option._id} value={option._id}>
            {option.name}
          </option>
        ))}
      </Form.Control>
      {error && <Alert variant="danger">{error}</Alert>}
    </Form.Group>
    // <div className="form-group">
    //   <select name={name} id={name} {...otherProps} className="form-control">
    //     <option value="" />
    //     {options.map((option) => (
    //       <option key={option._id} value={option._id}>
    //         {option.name}
    //       </option>
    //     ))}
    //   </select>
    // </div>
  );
};

export default Select;
