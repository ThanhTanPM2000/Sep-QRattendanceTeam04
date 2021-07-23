import React from "react";
import { Link } from "react-router-dom";
import TableCommon from "./common/table";

import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";

const StudentTable = ({
  students,
  sortColumn,
  onShowConfirm,
  onSort,
  onShowUpdate,
}) => {
  const columns = [
    { path: "studentId", label: "Student ID" },
    {
      path: "name",
      label: "Display Name",
      content: (student) => (
        <Link to={`/users/${student._id}`}>{student.name}</Link>
      ),
    },
    { path: "mail", label: "Mail" },
    {
      key: "edit",
      content: (student) => (
        <OverlayTrigger
          overlay={<Tooltip id="tooltip-537440761">Edit Student..</Tooltip>}
        >
          <Button
            className="btn-simple btn-link p-1"
            type="button"
            variant="info"
            onClick={() => onShowUpdate(student)}
          >
            <i className="fas fa-edit"></i>
          </Button>
        </OverlayTrigger>
      ),
    },
    {
      key: "delete",
      content: (student) => (
        <OverlayTrigger
          overlay={<Tooltip id="tooltip-21130535">Remove..</Tooltip>}
        >
          <Button
            onClick={() => onShowConfirm(student)}
            className="btn-simple btn-link p-1"
            type="button"
            variant="danger"
          >
            <i className="fas fa-times"></i>
          </Button>
        </OverlayTrigger>
      ),
    },
  ];

  return (
    <TableCommon
      columns={columns}
      data={students}
      sortColumn={sortColumn}
      onSort={onSort}
    />
  );
};

export default StudentTable;
