import React, { Component } from "react";
import _ from "lodash";
import { Link } from "react-router-dom";

import UsersTable from "./usersTable";
import ListGroup from "./common/listGroup";
import Pagination from "./common/pagination";
import SearchBox from "./common/searchBox";
import { getUsers } from "../services/fakeUsersService.js";
import { getFaculties } from "../services/fakeFacultiesService";
import { paginate } from "../utils/paginate";

class Users extends Component {
  state = {
    users: [],
    faculties: [],
    currentPage: 1,
    selectedFaculty: { _id: "", name: "All Faculties" },
    searchQuery: "",
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
    this.setState({
      selectedFaculty: faculty,
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
      currentPage: 1,
    });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      searchQuery,
      selectedFaculty,
      sortColumn,
      users: allUsers,
    } = this.state;

    let filtered = allUsers;
    if (searchQuery) {
      filtered = allUsers.filter((x) =>
        x.displayName.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    } else if (selectedFaculty && selectedFaculty._id)
      filtered = allUsers.filter((m) => m.faculty._id === selectedFaculty._id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const users = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, data: users };
  };

  render() {
    const { length: count } = this.state.users;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;

    if (count === 0) return <p>There are no users in the database</p>;
    const { totalCount, data: users } = this.getPagedData();

    return (
      <div className="row ml-2 mt-3">
        <div className="col-md-2">
          <div className="card">
            <ListGroup
              items={this.state.faculties}
              selectedItem={this.state.selectedFaculty}
              onItemSelect={this.handleFacultiesSelect}
            />
          </div>
        </div>

        <div className="col-md">
          <div className="card" style={{ padding: 25 }}>
            <Link
              to="/users/new"
              className="btn btn-primary"
              style={{ marginBottom: 20, width: 150 }}
            >
              Create User
            </Link>
            <p>
              Showing <span class="badge badge-primary">{totalCount}</span>{" "}
              users in the database
            </p>
            <SearchBox value={searchQuery} onChange={this.handleSearch} />
            <div className="card mb-3">
              <UsersTable
                users={users}
                sortColumn={sortColumn}
                onDelete={this.handleDelete}
                onSort={this.handleSort}
              />
            </div>
            <Pagination
              itemsCount={totalCount}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={this.handlePageChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Users;
