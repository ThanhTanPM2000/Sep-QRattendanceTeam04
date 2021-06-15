import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "./common/table";

class UsersTable extends Component {
  columns = [
    { path: "id", label: "Id" },
    {
      path: "displayName",
      label: "Display Name",
      content: (user) => (
        <Link to={`/users/${user._id}`}>{user.displayName}</Link>
      ),
    },
    { path: "mail", label: "Mail" },
    { path: "role", label: "Role" },
    {
      key: "edit",
      content: (user) => (
        <button className="btn btn-primary btn-sm">Edit</button>
      ),
    },
    {
      key: "delete",
      content: (user) => (
        <button
          onClick={() => this.props.onDelete(user)}
          className="btn btn-danger btn-sm"
        >
          Delete
        </button>
      ),
    },
  ];
  render() {
    const { users, onSort, sortColumn } = this.props;
    return (
      <Table
        columns={this.columns}
        data={users}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default UsersTable;
