import React from "react";
import { Link } from "react-router-dom";
import TableCommon from "./common/table";

import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";

import auth from "services/authService";

const ClassTable = ({
  classes,
  sortColumn,
  onShowConfirm,
  onSort,
  onShowUpdate,
  onShowExtendClassModal,
}) => {
  const classColumns = [
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
    { path: "semester.name", label: "Semester" },
    {
      key: "manageStudent",
      content: (myClass) => (
        <Button
          className="btn-fill btn-wd"
          type="button"
          variant="warning"
          onClick={() => onShowExtendClassModal(myClass)}
        >
          Tools
        </Button>
      ),
    },
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
  ];

  const [constructorHasRun, setConstructorHasRun] = React.useState(false);
  const [columns, setColumns] = React.useState(classColumns);

  const deleteColumns = () => {
    return {
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
    };
  };

  const constructor = () => {
    if (constructorHasRun) return;
    const user = auth.getCurrentUser();
    let newColumns = [...columns];
    if (user.role === "admin") {
      newColumns.push(deleteColumns());
      setColumns(newColumns);
    }
    setConstructorHasRun(true);
  };

  constructor();

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
