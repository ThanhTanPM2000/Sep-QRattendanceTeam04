import React from "react";
import { FormControl } from "react-bootstrap";

const SearchBox = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <FormControl
      type="text"
      name="query"
      className="mr-sm-2 mb-2"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
    />
  );
};

export default SearchBox;
