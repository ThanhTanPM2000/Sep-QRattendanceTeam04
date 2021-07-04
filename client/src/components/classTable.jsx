import React from "react";
import { Link } from "react-router-dom";
import TableCommon from "./common/table";

import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";

const ClassTable = ({
  classes,
  sortColumn,
  onShowConfirm,
  onSort,
  onShowUpdate,
}) => {
  const columns = [
    { path: "classTermId", label: "ClassTermId" },
    {
      path: "name",
      label: "DisplayName",
      content: (user) => <Link to={`/users/${user._id}`}>{user.name}</Link>,
    },
    { path: "courseType", label: "Course Type" },
    { path: "room", label: "Room" },
    { path: "lecturer.name", label: "Lecturer" },
    { path: "numOfStudents", label: "Num Students" },
    {
      key: "edit",
      content: (myClass) => (
        <OverlayTrigger
          overlay={<Tooltip id="tooltip-537440761">Edit Class..</Tooltip>}
        >
          <Button
            className="btn-simple btn-link p-1"
            type="button"
            variant="info"
            onClick={() => onShowUpdate(myClass)}
          >
            <i className="fas fa-edit"></i>
          </Button>
        </OverlayTrigger>
      ),
    },
    {
      key: "delete",
      content: (myClass) => (
        <OverlayTrigger
          overlay={<Tooltip id="tooltip-21130535">Remove..</Tooltip>}
        >
          <Button
            onClick={() => onShowConfirm(myClass)}
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
      data={classes}
      sortColumn={sortColumn}
      onSort={onSort}
    />
  );
};

export default ClassTable;
