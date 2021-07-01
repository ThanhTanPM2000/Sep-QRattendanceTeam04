import React, { Component } from "react";
import Joi from "joi";

import Input from "./input";
import Select from "./select";

import { Form, Button } from "react-bootstrap";

class FormCommon extends Component {
  state = {
    data: {},
    errors: {},
  };

  validate = () => {
    const errors = {};
    const { data } = this.state;

    const { error } = this.schema.validate(data, { abortEarly: false });
    if (!error) return null;

    for (let item of error.details) errors[item.path[0]] = item.message;

    console.log(errors);

    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = Joi.object({ [name]: this.schema.extract(name) });
    const { error } = schema.validate(obj, { abortEarly: false });

    return error ? error.details[0].message : null;
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const errors = this.validate();
    if (errors) {
      this.setState({ errors: errors || {} });
      return;
    }

    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = {};
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    let data = { ...this.state.data };
    data[input.name] = input.value;

    data = this.doChange(input, data);

    this.setState({ data, errors });
  };

  renderInput = (name, label, placeholder, isReadonly = false) => {
    const { data, errors } = this.state;

    return (
      <Input
        name={name}
        label={label}
        value={data[name]}
        errors={errors}
        placeholder={placeholder}
        onChange={this.handleChange}
        readOnly={isReadonly}
      />
    );
  };

  renderSubmit = (label) => {
    return (
      <Button
        type="submit"
        disabled={this.validate()}
        variant="primary"
        className="btn-fill btn-wd"
      >
        {label}
      </Button>
    );
  };

  renderSelect = (name, label, options, isReadOnly = false) => {
    const { data, errors } = this.state;

    return (
      <Select
        name={name}
        label={label}
        options={options}
        value={data[name]}
        onChange={this.handleChange}
        errors={errors}
        isReadOnly={isReadOnly}
      />
    );
  };
}

export default FormCommon;
