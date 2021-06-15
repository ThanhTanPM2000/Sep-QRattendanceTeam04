import React, { Component } from "react";
import UsersTable from "./usersTable";
import ListGroup from "./common/listGroup";
import Pagination from "./common/pagination";
import _ from "lodash";
import { getUsers } from "../services/fakeUsersService.js";
import { getFaculties } from "../services/fakeFacultiesService";
import { paginate } from "../utils/paginate";

class Users extends Component {
  state = {
    users: [],
    faculties: [],
    currentPage: 1,
    selectedFaculty: { _id: "", name: "All Faculties" },
    pageSize: 3,
    sortColumn: { path: "displayName", order: "asc" },
  };

  componentDidMount() {
    const faculties = [this.state.selectedFaculty, ...getFaculties()];
    this.setState({ users: getUsers(), faculties });
  }

  handleDelete = (user) => {
    const users = this.state.users.filter((m) => m._id !== user._id);
    this.setState({ users });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleFacultiesSelect = (faculty) => {
    this.setState({ selectedFaculty: faculty, currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      selectedFaculty,
      sortColumn,
      users: allUsers,
    } = this.state;

    const filtered =
      selectedFaculty && selectedFaculty._id
        ? allUsers.filter((m) => m.faculty._id === selectedFaculty._id)
        : allUsers;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const users = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, data: users };
  };

  render() {
    const { length: count } = this.state.users;
    const { pageSize, currentPage, sortColumn } = this.state;

    if (count === 0) return <p>There are no users in the database</p>;
    const { totalCount, data: users } = this.getPagedData();

    return (
      <div className="row ml-2 mt-3">
        <div className="col-2">
          <ListGroup
            items={this.state.faculties}
            selectedItem={this.state.selectedFaculty}
            onItemSelect={this.handleFacultiesSelect}
          />

          <div className="mt-5">
            <ListGroup
              items={this.state.faculties}
              selectedItem={this.state.selectedFaculty}
              onItemSelect={this.handleFacultiesSelect}
            />
          </div>
        </div>
        <div className="col">
          <p>Showing {totalCount} users in the database</p>
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
