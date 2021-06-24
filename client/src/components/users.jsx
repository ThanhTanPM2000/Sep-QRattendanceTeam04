import React, { Component } from "react";
import _ from "lodash";
import { Link } from "react-router-dom";

import UsersTable from "./usersTable";
import ListGroup from "./common/listGroup";
import Pagination from "./common/pagination";
import SearchBox from "./common/searchBox";
import { deleteUser, getUsers } from "../services/userService.js";
import { getFaculties } from "../services/facultyService";
import { getRoles } from "../services/roleService";
import { paginate } from "../utils/paginate";
import { toast } from "react-toastify";

class Users extends Component {
  state = {
    users: [],
    faculties: [],
    roles: [],
    currentPage: 1,
    selectedFaculty: { _id: "", name: "All Faculties" },
    selectedRole: { _id: "", name: "All Roles" },
    searchQuery: "",
    pageSize: 10,
    sortColumn: { path: "name", order: "asc" },
  };

  async componentDidMount() {
    try {
      let { data: faculties } = await getFaculties();
      faculties = [this.state.selectedFaculty, ...faculties];

      let { data: roles } = await getRoles();
      roles = [this.state.selectedRole, ...roles];

      let { data: users } = await getUsers();
      this.setState({ users, faculties, roles });
    } catch (error) {}
  }

  handleDelete = async (user) => {
    const originalUser = [...this.state.users];

    const users = originalUser.filter((m) => m._id !== user._id);
    this.setState({ users });

    try {
      await deleteUser(user);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("This user has already delete");
      } else if (error.response && error.response.status === 403) {
        toast.error("Access denied");
      }
      this.setState({ users: originalUser });
    }
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleFacultiesSelect = (faculty) => {
    this.setState({
      selectedFaculty: faculty,
      searchQuery: "",
      currentPage: 1,
    });
  };

  handleRolesSelect = (role) => {
    this.setState({
      selectedRole: role,
      searchQuery: "",
      currentPage: 1,
    });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleSearch = (query) => {
    this.setState({
      searchQuery: query,
      selectedFaculty: this.state.faculties[0],
      selectedRole: this.state.roles[0],
      currentPage: 1,
    });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      searchQuery,
      selectedFaculty,
      selectedRole,
      sortColumn,
      users: allUsers,
    } = this.state;

    let filtered = allUsers;
    if (searchQuery) {
      filtered = allUsers.filter((x) =>
        x.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    } else if (
      (selectedFaculty && selectedFaculty._id) ||
      (selectedRole && selectedRole._id)
    ) {
      if (selectedFaculty && selectedFaculty._id)
        filtered = allUsers.filter(
          (m) => m.faculty._id === selectedFaculty._id
        );
      if (selectedRole && selectedRole._id)
        filtered = allUsers.filter((m) => m.role._id === selectedRole._id);
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const users = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: users };
  };

  render() {
    const { length: count } = this.state.users;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { totalCount, data: users } = this.getPagedData();

    return (
      <div className="row">
        <div className="col-md-3">
          <div style={{ marginBottom: 29 }}>
            <ListGroup
              items={this.state.faculties}
              selectedItem={this.state.selectedFaculty}
              onItemSelect={this.handleFacultiesSelect}
            />
          </div>
          <ListGroup
            items={this.state.roles}
            selectedItem={this.state.selectedRole}
            onItemSelect={this.handleRolesSelect}
          />
        </div>

        <div className="auth-wrapper auth-inner col-md" style={{ padding: 20 }}>
          <div className="row">
            <div className="col-md">
              <p>
                Showing{" "}
                <span className="badge badge-primary">{totalCount}</span> users
                in the database
              </p>
            </div>
            <div className="col-md-3">
              <Link
                to="/users/new"
                className="btn btn-primary"
                style={{ marginBottom: 20, width: 150 }}
              >
                Create User
              </Link>
            </div>
          </div>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <UsersTable
            users={users}
            sortColumn={sortColumn}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Users;
