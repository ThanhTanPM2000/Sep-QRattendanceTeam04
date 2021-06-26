import React, { useEffect, useState } from "react";
import _ from "lodash";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import Pagination from "../components/common/pagination";
import ListGroup from "../components/common/listGroup";
import SearchBox from "../components/common/searchBox";
import UserTable from "../components/userTable";
import { paginate } from "../utils/paginate";
import { getFaculties } from "../services/facultyService";
import { getRoles } from "../services/roleService";
import { getUsers } from "../services/userService";
import { deleteUser } from "../services/userService";

const Users = () => {
  const [usersList, setUsers] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [roles, setRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFaculty, setSelectedFaculty] = useState({
    _id: "",
    name: "All Faculties",
  });
  const [selectedRole, setSelectedRole] = useState({
    _id: "",
    name: "All Roles",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState({
    path: "name",
    order: "asc",
  });

  useEffect(async () => {
    async function getDataFromApi() {
      try {
        let { data: newFaculties } = await getFaculties();
        newFaculties = [selectedFaculty, ...newFaculties];

        let { data: newRoles } = await getRoles();
        newRoles = [selectedRole, ...newRoles];

        let { data: newUsers } = await getUsers();

        setUsers(newUsers);
        setFaculties(newFaculties);
        setRoles(newRoles);

        // return () => {
        //   setUsers([]);
        //   setFaculties([]);
        //   setRoles([]);
        // };
      } catch (error) {}
    }

    getDataFromApi();
  }, []);

  const handleDelete = async (user) => {
    const originalUser = [...usersList];

    const newUsers = originalUser.filter((m) => m._id !== user._id);
    setUsers(newUsers);

    try {
      await deleteUser(user);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("This user has already delete");
      } else if (error.response && error.response.status === 403) {
        toast.error("Access denied");
      }
      setUsers(originalUser);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFacultiesSelect = async (faculty) => {
    await setSelectedFaculty(faculty);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleSort = async (sortColumn) => {
    await setSortColumn(sortColumn);
  };

  const handleSearch = async (query) => {
    await setSearchQuery(query);
    await setSelectedFaculty(faculties[0]);
    await setSelectedRole(roles[0]);
    await setCurrentPage(1);
  };

  const getPagedData = () => {
    let filtered = usersList;
    if (searchQuery) {
      filtered = usersList.filter((x) =>
        x.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    } else if (
      (selectedFaculty && selectedFaculty._id) ||
      (selectedRole && selectedRole._id)
    ) {
      if (selectedFaculty && selectedFaculty._id)
        filtered = usersList.filter(
          (m) => m.faculty._id === selectedFaculty._id
        );
      if (selectedRole && selectedRole._id)
        filtered = usersList.filter((m) => m.role._id === selectedRole._id);
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const users = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: users };
  };

  const { totalCount, data: newUsers } = getPagedData();

  return (
    <div className="row">
      <div className="col-md-3">
        <div style={{ marginBottom: 29 }}>
          <ListGroup
            items={faculties}
            selectedItem={selectedFaculty}
            onItemSelect={handleFacultiesSelect}
          />
        </div>
        <ListGroup
          items={roles}
          selectedItem={selectedRole}
          onItemSelect={handleRoleSelect}
        />
      </div>

      <div className="auth-wrapper auth-inner col-md" style={{ padding: 20 }}>
        <div className="row">
          <div className="col-md">
            <p>
              Showing <span className="badge badge-primary">{totalCount}</span>{" "}
              users in the database
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
        <SearchBox value={searchQuery} onChange={handleSearch} />
        <UserTable
          users={newUsers}
          sortColumn={sortColumn}
          onDelete={handleDelete}
          onSort={handleSort}
        />
        <Pagination
          itemsCount={totalCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Users;
