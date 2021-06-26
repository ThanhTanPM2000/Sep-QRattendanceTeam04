import React from "react";
import { Link } from "react-router-dom";
import TableCommon from "./common/table";

const SemesterTable = ({ onDelete, semesters, onSort, sortColumn }) => {
  const columns = [
    { path: "name", label: "Name" },
    { path: "year", label: "Year" },
    { path: "symbol", label: "Symbol" },
    {
      key: "edit",
      content: (semester) => (
        <Link to={`/semesters/${semester._id}`} className="btn btn-primary btn-sm">
          Edit
        </Link>
      ),
    },
    {
      key: "delete",
      content: (semester) => (
        <button
          onClick={() => onDelete(semester)}
          className="btn btn-danger btn-sm"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <TableCommon
      columns={columns}
      data={semesters}
      sortColumn={sortColumn}
      onSort={onSort}
    />
  );
};

export default SemesterTable;
