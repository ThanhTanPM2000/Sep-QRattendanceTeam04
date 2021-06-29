import React from "react";
import { Link } from "react-router-dom";
import TableCommon from "./common/table";

import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";

const SemesterTable = ({
  semesters,
  sortColumn,
  onShowConfirm,
  onSort,
  onShowUpdate,
}) => {
  const columns = [
    { path: "year", label: "Year" },
    {
      path: "name",
      label: "Display Name",
      content: (semester) => (
        <Link to={`/semesters/${semester._id}`}>{semester.name}</Link>
      ),
    },
    { path: "symbol", label: "Symbol" },
    {
      key: "edit",
      content: (semester) => (
        <OverlayTrigger
          overlay={<Tooltip id="tooltip-537440761">Edit Semester.</Tooltip>}
        >
          <Button
            className="btn-simple btn-link p-1"
            type="button"
            variant="info"
            onClick={() => onShowUpdate(semester)}
          >
            <i className="fas fa-edit"></i>
          </Button>
        </OverlayTrigger>
      ),
    },
    {
      key: "delete",
      content: (semester) => (
        <OverlayTrigger
          overlay={<Tooltip id="tooltip-21130535">Remove Semester</Tooltip>}
        >
          <Button
            onClick={() => onShowConfirm(semester)}
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
      data={semesters}
      sortColumn={sortColumn}
      onSort={onSort}
    />
  );
};

export default SemesterTable;
