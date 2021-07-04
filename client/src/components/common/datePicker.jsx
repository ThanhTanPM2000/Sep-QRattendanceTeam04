import React from "react";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import vi from "date-fns/locale/vi";

import { InputGroup, Form, Alert } from "react-bootstrap";
registerLocale("vi", vi);
setDefaultLocale("vi");

const DateRangerPicker = ({
  propStartDate,
  propEndDate,
  label,
  startDate,
  endDate,
  onChange,
  errors,
}) => {
  const ExampleCustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <Form.Control
      autoComplete="off"
      // onChange={onChange}
      defaultValue={value}
      onClick={onClick}
      placeholder={label}
      ref={ref}
    />
  ));

  return (
    <Form.Group>
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text id="tddd">{label}</InputGroup.Text>
        </InputGroup.Prepend>
        <DatePicker
          selectsRange={true}
          dateFormat="dd/MM/yyyy"
          locale="vi"
          startDate={startDate}
          endDate={endDate}
          isClearable={true}
          ariaDescribedBy="tddd"
          customInput={<ExampleCustomInput />}
          onChange={(update) => onChange(update)}
        />
      </InputGroup>
      {errors[propStartDate] && (
        <Alert variant="danger">{errors[propStartDate]}</Alert>
      )}
      {errors[propEndDate] && (
        <Alert variant="danger">{errors[propEndDate]}</Alert>
      )}
    </Form.Group>
  );
};

export default DateRangerPicker;
