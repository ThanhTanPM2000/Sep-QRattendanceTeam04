import React from "react";
import _ from "lodash";
import { toast } from "react-toastify";

import Pagination from "../components/common/pagination";
import SearchBox from "../components/common/searchBox";
import UserTable from "../components/userTable";
import { paginate } from "../utils/paginate";
import UserService from "../services/userService";
import LoadingPage from "../components/common/loadingPage";

// react-bootstrap components
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import ModalForm from "components/common/modalForm";
import UserForm from "components/userForm";
import ModalConfirm from "components/common/modalConfirm";

import auth from "../services/authService";

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

  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function getDataFromApi() {
      try {
        let { data: newUsers } = await UserService.getUsers();
        const currentUser = auth.getCurrentUser();
        newUsers.filter((x) => x._id !== currentUser?._id);
        setLoading(false);
        setUsers(newUsers);
      } catch (error) {
        console.log("hello");
      }
    }

    getDataFromApi();
  }, [selectedUser]);

  const handleShowConfirmDialog = (user) => {
    setSelectedUser(user);
    setConfirmDeleteDialog(true);
  };

  const handleUserDelete = async (user) => {
    const originalUser = [...usersList];

    const newUsers = originalUser.filter((m) => m._id !== user._id);
    setUsers(newUsers);

    try {
      await UserService.deleteUser(user);
      toast.success("Delete user successfully");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("This user has already delete");
      } else if (error.response && error.response.status === 403) {
        toast.error("Access denied");
      } else {
        toast.error(error.response.data);
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
          x.mail = user.mail;
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
      filtered = usersList.filter(
        (x) =>
          x.name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          x.mail.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          x.userId.toLowerCase().startsWith(searchQuery.toLowerCase())
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
        <ModalForm
          titleHeader={!selectedUser._id ? "Create User" : "Update User"}
          show={modalShow}
          onHide={() => setModalShow(false)}
        >
          <UserForm
            onHide={() => setModalShow(false)}
            onUpdateUsers={handleUsersUpdate}
            selectedUser={selectedUser}
          />
        </ModalForm>
        <ModalConfirm
          onHide={() => setConfirmDeleteDialog(false)}
          onDelete={handleUserDelete}
          show={confirmDeleteDialog}
          data={selectedUser}
        />
        <Row>
          <Col md="12">
            <Card className="striped-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Manage Users</Card.Title>
                <p className="card-category">
                  Showing{" "}
                  <span className="badge badge-primary">{totalCount}</span>{" "}
                  users in the database
                </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-auto py-auto">
                <Row>
                  <Col>
                    <SearchBox value={searchQuery} onChange={handleSearch} />
                  </Col>
                  <Col>
                    <Button
                      className="btn-fill btn-wd"
                      variant="primary"
                      onClick={() => {
                        setSelectedUser({});
                        setModalShow(true);
                      }}
                    >
                      <i className="fas fa-plus-circle"></i> Create User
                    </Button>
                  </Col>
                </Row>
                <LoadingPage isLoading={isLoading}>
                  {totalCount === 0 ? (
                    <p>Data empty</p>
                  ) : (
                    <>
                      <UserTable
                        users={newUsers}
                        sortColumn={sortColumn}
                        selectedData={selectedUser}
                        onShowConfirm={handleShowConfirmDialog}
                        onSort={handleSort}
                        onShowUpdate={handleShowUpdateDialog}
                      />
                      <div className="ml-3">
                        <Pagination
                          itemsCount={totalCount}
                          pageSize={pageSize}
                          currentPage={currentPage}
                          onPageChange={handlePageChange}
                        />
                      </div>
                    </>
                  )}
                </LoadingPage>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default React.memo(Users);
