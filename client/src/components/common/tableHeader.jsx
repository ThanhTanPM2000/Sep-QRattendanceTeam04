import React from "react";

const tableHeader = ({ columns, sortColumn, onSort }) => {
  const raiseSort = (path) => {
    const newSortColumn = { ...sortColumn };
    if (newSortColumn.path === path)
      newSortColumn.order = newSortColumn.order === "asc" ? "desc" : "asc";
    else {
      newSortColumn.path = path;
      newSortColumn.order = "asc";
    }
    onSort(newSortColumn);
  };

  const renderSortIcon = (column) => {
    if (column.path !== sortColumn.path) return null;
    if (sortColumn.order === "asc")
      return <i className="fas fa-sort-amount-up" />;
    return <i className="fas fa-sort-amount-down-alt" />;
  };

  return (
    <thead className="thead-dark">
      <tr>
        {columns.map((column) => (
          <th
            className={column.path ? "clickable border-0" : "border-0"}
            style={!column.path ? { width: "100px" } : {}}
            key={column.path || column.key}
            onClick={() => (column.path ? raiseSort(column.path) : null)}
          >
            {column.label} {renderSortIcon(column)}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default tableHeader;
