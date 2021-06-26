import React from "react";
import _ from "lodash";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import Pagination from "../components/common/pagination";
import ListGroup from "../components/common/listGroup";
import SearchBox from "../components/common/searchBox";
import UserTable from "../components/userTable";
import LoadingPage from "../components/loadingPage";
import { paginate } from "../utils/paginate";
import { getFaculties } from "../services/facultyService";
import { getRoles } from "../services/roleService";
import { getUsers } from "../services/userService";
import { deleteUser } from "../services/userService";

// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
} from "react-bootstrap";

function Users() {
  const [usersList, setUsers] = React.useState([]);
  const [faculties, setFaculties] = React.useState([]);
  const [roles, setRoles] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedFaculty, setSelectedFaculty] = React.useState({
    _id: "",
    name: "All Faculties",
  });
  const [selectedRole, setSelectedRole] = React.useState({
    _id: "",
    name: "All Roles",
  });
  const [searchQuery, setSearchQuery] = React.useState("");
  const [pageSize, setPageSize] = React.useState(4);
  const [sortColumn, setSortColumn] = React.useState({
    path: "name",
    order: "asc",
  });

  React.useEffect(() => {
    async function getDataFromApi() {
      try {
        // let { data: newFaculties } = await getFaculties();
        // newFaculties = [selectedFaculty, ...newFaculties];

        // let { data: newRoles } = await getRoles();
        // newRoles = [selectedRole, ...newRoles];

        let { data: newUsers } = await getUsers();

        setUsers(newUsers);
        // setFaculties(newFaculties);
        // setRoles(newRoles);
      } catch (error) {
        console.log("hello");
      }
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
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="card-plain table-plain-bg">
              <Card.Header>
                <Card.Title as="h4">Table on Plain Background</Card.Title>
                <p className="card-category">
                  Here is a subtitle for this table
                </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
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
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Users;
