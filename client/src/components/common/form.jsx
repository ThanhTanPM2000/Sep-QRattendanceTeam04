import React, { Component } from "react";
import Joi from "joi";

import Input from "./input";

class Form extends Component {
  state = {
    data: {},
    errors: {},
  };

  validate = () => {
    const errors = {};
    const { data } = this.state;

    const { error } = this.schema.validate(data, { abortEarly: false });
    if (!error) return null;

    for (let item of error.details) errors[item.path] = item.message;

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
    if (errors) this.setState({ errors: errors || {} });

    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = {};
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data, errors });
  };

  renderInput = (name, label, type = "text") => {
    const { data, errors } = this.state;

    return (
      <Input
        name={name}
        label={label}
        value={data[name]}
        errors={errors}
        type={type}
        onChange={this.handleChange}
      />
    );
  };

  renderSubmit = (label) => {
    return (
      <button onClick={this.handleSubmit} className="btn btn-primary btn-sm">
        {label}
      </button>
    );
  };
}

export default Form;
