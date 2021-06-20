import React from "react";

const ListGroup = ({
  items,
  textProperty,
  valueProperty,
  selectedItem,
  onItemSelect,
}) => {
  return (
    <ul className="list-group" style={{ height: "auto" }}>
      {items.map((item) => (
        <li
          style={{ cursor: "pointer" }}
          onClick={() => onItemSelect(item)}
          key={item[valueProperty]}
          className={
            item === selectedItem
              ? "list-group-item list-group-item-action active"
              : "list-group-item list-group-item-action"
          }
        >
          {item[textProperty]}
        </li>
      ))}
    </ul>
  );
};

ListGroup.defaultProps = {
  textProperty: "name",
  valueProperty: "_id",
};

export default ListGroup;
