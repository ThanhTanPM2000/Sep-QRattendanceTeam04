import React from "react";
import { Link } from "react-router-dom";

import Table from "./common/table";

const UserTable = ({ onDelete, users, onSort, sortColumn }) => {
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
        <Link to={`/users/${user._id}`} className="btn btn-primary btn-sm">
          Edit
        </Link>
      ),
    },
    {
      key: "delete",
      content: (user) => (
        <button
          onClick={() => onDelete(user)}
          className="btn btn-danger btn-sm"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={users}
      sortColumn={sortColumn}
      onSort={onSort}
    />
  );
};

export default UserTable;
