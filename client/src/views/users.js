import React from "react";
import _ from "lodash";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";

import Pagination from "../components/common/pagination";
import ListGroup from "../components/common/listGroup";
import SearchBox from "../components/common/searchBox";
import UserTable from "../components/userTable";
import LoadingPage from "../components/common/loadingPage";
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
import ModalCommon from "components/common/modal";
import UserForm from "./UserForm";
import DeleteConfirm from "components/common/deleteConfirm";

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
  const [pageSize, setPageSize] = React.useState(10);
  const [sortColumn, setSortColumn] = React.useState({
    path: "name",
    order: "asc",
  });
  const [selectedUser, setSelectedUser] = React.useState({});
  const [modalShow, setModalShow] = React.useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = React.useState(false);

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

  const handleShowConfirmDialog = (user) => {
    setSelectedUser(user);
    setConfirmDeleteDialog(true);
  };

  const handleUserDelete = async (user) => {
    const originalUser = [...usersList];

    const newUsers = originalUser.filter((m) => m._id !== user._id);
    setUsers(newUsers);

    try {
      await deleteUser(user);
      toast.success("Delete user successfully");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("This user has already delete");
      } else if (error.response && error.response.status === 403) {
        toast.error("Access denied");
      }
      setUsers(originalUser);
    }
    setConfirmDeleteDialog(false);
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

  const handleShowUpdateDialog = (user) => {
    setSelectedUser(user);
    setModalShow(true);
  };

  const handleUsersUpdate = (user) => {
    let newUserList = [...usersList];
    const userData = newUserList.find((x) => x._id === user._id);
    if (userData) {
      newUserList.map((x) => {
        if (x._id === user._id) {
          x.userId = user.userId;
          x.name = user.name;
          x.degree = user.degree;
          x.faculty = user.faculty;
          x.role = user.role;
        }
      });
    } else {
      newUserList = [user, ...usersList];
    }
    setUsers(newUserList);
    setModalShow(false);
  };

  const handleSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedFaculty(faculties[0]);
    setSelectedRole(roles[0]);
    setCurrentPage(1);
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
        <ModalCommon
          titleHeader="Create User"
          show={modalShow}
          onHide={() => setModalShow(false)}
        >
          <UserForm
            onHide={() => setModalShow(false)}
            onUpdateUsers={handleUsersUpdate}
            selectedUser={selectedUser}
          />
        </ModalCommon>
        <DeleteConfirm
          onHide={() => setConfirmDeleteDialog(false)}
          onDelete={handleUserDelete}
          show={confirmDeleteDialog}
          data={selectedUser}
        />
        <Row>
          <Col md="12">
            <Card className="card-plain table-plain-bg">
              <Card.Header>
                <Row>
                  <Col md="10">
                    <Card.Title as="h4">Manage Users</Card.Title>
                    <p className="card-category">
                      Showing{" "}
                      <span className="badge badge-primary">{totalCount}</span>{" "}
                      users in the database
                    </p>
                  </Col>

                  <Col md="2">
                    <Button
                      onClick={() => {
                        setSelectedUser({});
                        setModalShow(true);
                      }}
                      variant="primary"
                    >
                      <i className="fas fa-plus-circle"></i> Create User
                    </Button>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <LoadingPage data={usersList}>
                  <SearchBox value={searchQuery} onChange={handleSearch} />
                  <UserTable
                    users={newUsers}
                    sortColumn={sortColumn}
                    selectedData={selectedUser}
                    onShowConfirm={handleShowConfirmDialog}
                    onSort={handleSort}
                    onShowUpdate={handleShowUpdateDialog}
                  />
                  <Pagination
                    itemsCount={totalCount}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                </LoadingPage>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Users;
