import React, { Component } from "react";
import Joi from "joi";

import Input from "./input";
import Select from "./select";
import DateRangerPicker from "./datePicker";
import moment from "moment";

import { Button } from "react-bootstrap";
import { PureComponent } from "react";

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

    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = Joi.object({ [name]: this.schema.extract(name) });
    const { error } = schema.validate(obj, { abortEarly: false });

    return error ? error.details[0].message : null;
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    this.setState({ isHandling: true });

    const errors = this.validate();
    if (errors) {
      this.setState({ errors: errors || {} });
      return;
    }

    await this.doSubmit();
    this.setState({ isHandling: false });
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = {};
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    let data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ errors });

    data = this.doChange(input, data);

    this.setState({ data });
  };

  handleDatePickerChange = (update) => {
    const errors = {};
    if (update[0] === null) errors["startDate"] = "Start Date not empty";
    else delete errors["startDate"];

    if (update[1] === null) errors["endDate"] = "End Date not empty";
    else delete errors["endDate"];

    this.setState({ errors });

    const data = { ...this.state.data };
    data.startDate = update[0];
    data.endDate = update[1];
    this.setState({ data });
    console.log("data ", data);
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
    const { isHandling } = this.state;

    return isHandling ? (
      <Button disabled variant="primary" className="btn-fill btn-wd">
        Waiting
      </Button>
    ) : (
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

  renderSelect = (
    name,
    label,
    options,
    propDisplay = "name",
    isReadOnly = false
  ) => {
    const { data, errors } = this.state;

    return (
      <Select
        name={name}
        label={label}
        options={options}
        value={data[name]}
        onChange={this.handleChange}
        errors={errors}
        propDisplay={propDisplay}
        isReadOnly={isReadOnly}
      />
    );
  };

  renderDatePicker = (propStartDate, propEndDate, label) => {
    const { data, errors } = this.state;
    return (
      <DateRangerPicker
        propStartDate={propStartDate}
        propEndDate={propEndDate}
        label={label}
        startDate={data[propStartDate]}
        endDate={data[propEndDate]}
        errors={errors}
        onChange={this.handleDatePickerChange}
      />
    );
  };
}

export default FormCommon;
