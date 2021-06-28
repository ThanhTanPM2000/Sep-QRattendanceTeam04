import React from "react";
import { Link } from "react-router-dom";
import TableCommon from "./common/table";

import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";

const UserTable = ({
  users,
  sortColumn,
  onShowConfirm,
  onSort,
  onShowUpdate,
}) => {
  const columns = [
    { path: "userId", label: "UserId" },
    {
      path: "name",
      label: "Display Name",
      content: (user) => <Link to={`/users/${user._id}`}>{user.name}</Link>,
    },
    { path: "mail", label: "Mail" },
    { path: "degree", label: "Degree" },
    { path: "faculty.name", label: "Faculty Name" },
    { path: "role.name", label: "Role" },
    {
      key: "edit",
      content: (user) => (
        <OverlayTrigger
          overlay={<Tooltip id="tooltip-537440761">Edit User..</Tooltip>}
        >
          <Button
            className="btn-simple btn-link p-1"
            type="button"
            variant="info"
            onClick={() => onShowUpdate(user)}
          >
            <i className="fas fa-edit"></i>
          </Button>
        </OverlayTrigger>
      ),
    },
    {
      key: "delete",
      content: (user) => (
        <OverlayTrigger
          overlay={<Tooltip id="tooltip-21130535">Remove..</Tooltip>}
        >
          <Button
            onClick={() => onShowConfirm(user)}
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
      data={users}
      sortColumn={sortColumn}
      onSort={onSort}
    />
  );
};

export default UserTable;
