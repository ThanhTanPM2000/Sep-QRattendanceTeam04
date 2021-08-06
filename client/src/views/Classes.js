import React from "react";
import _ from "lodash";
import { toast } from "react-toastify";

import ClassForm from "../components/classForm";

import Pagination from "../components/common/pagination";
import SearchBox from "../components/common/searchBox";
import ClassTable from "../components/classTable";
import { paginate } from "../utils/paginate";
import ClassService from "../services/classService";

import LoadingPage from "../components/common/loadingPage";

// react-bootstrap components
import { Button, Card, Container, Row, Col } from "react-bootstrap";

import ModalForm from "components/common/modalForm";
import ModalImportClass from "components/modalImportClass";
import ModalConfirm from "components/common/modalConfirm";
import ExtendClassModal from "components/extendClassModal";

import auth from "services/authService";
import { SocketContext } from "../services/socketIo";

function Classes() {
  const [classes, setClasses] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [pageSize] = React.useState(10);
  const [sortColumn, setSortColumn] = React.useState({
    path: "lastUpdated",
    order: "desc",
  });
  const [selectedClass, setSelectedClass] = React.useState({});
  const [prevSelected, setPrevSelect] = React.useState({});

  // modal variable
  const [modalShow, setModalShow] = React.useState(false);
  const [modalImport, setModalImport] = React.useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = React.useState(false);
  const [modalExtendClass, setModalExtendClass] = React.useState(false);

  const [isLoading, setLoading] = React.useState(true);
  const socket = React.useContext(SocketContext);

  React.useEffect(() => {
    async function getDataFromApi() {
      try {
        let { data: classes } = await ClassService.getClasses();

        setLoading(false);
        setClasses(classes);

        if (!_.isEmpty(selectedClass?._id)) {
          const result = await classes.find((x) => x._id === selectedClass._id);
          if (!_.isEqual(result, prevSelected)) {
            await setSelectedClass(result);
            await setPrevSelect(result);
          }
        }
      } catch (error) {
        toast.error(error.response?.data);
      }
    }

    getDataFromApi();

    socket.on("getNewClasses", (classes) => {
      setClasses(classes);
    });

    socket.on("deleteClasses", (classes) => {
      setClasses(classes);
      setModalShow(false);
      setModalExtendClass(false);
    });

    socket.on("newStudent", (myClass) => {
      handleClassUpdate(myClass);
    });
  }, [socket]);

  const handleShowConfirmDialog = (myClass) => {
    setSelectedClass(myClass);
    // setPrevSelect(myClass);
    setConfirmDeleteDialog(true);
  };

  const handleClassDelete = async (myClass) => {
    const originalClass = [...classes];

    const newClass = originalClass.filter((m) => m._id !== myClass._id);
    setClasses(newClass);

    try {
      await ClassService.deleteClass(myClass);
      toast.success("Delete Class successfully");
      setConfirmDeleteDialog(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("This Class has already delete");
      } else {
        toast.error(error.response.data);
      }
      setClasses(originalClass);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleShowUpdateDialog = (myClass) => {
    setSelectedClass(myClass);
    // setPrevSelect(myClass);
    setModalShow(true);
  };

  const handleShowExtendClassModal = (myClass) => {
    setSelectedClass(myClass);
    // setPrevSelect(myClass);
    setModalExtendClass(true);
  };

  const handleClassUpdate = (myClass) => {
    setSelectedClass(myClass);
    setModalShow(false);
  };

  const handleImportExcel = (newClasses) => {
    const newClass = [...classes, ...newClasses];
    setClasses(newClass);
  };

  const handleSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const getPagedData = () => {
    let filtered = classes;
    if (searchQuery) {
      filtered = classes.filter(
        (x) =>
          x.name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          x.classTermId.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          x.semester.name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          x.lecturer.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const newClasses = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: newClasses };
  };

  const { totalCount, data: newClasses } = getPagedData();

  return (
    <>
      <Container fluid>
        <ModalForm
          titleHeader={!selectedClass?._id ? "Create Class" : "Update Class"}
          show={modalShow}
          onHide={() => setModalShow(false)}
        >
          <ClassForm
            onHide={() => setModalShow(false)}
            onUpdateClass={handleClassUpdate}
            selectedClass={selectedClass}
          />
        </ModalForm>
        <ModalConfirm
          onHide={() => setConfirmDeleteDialog(false)}
          onDelete={handleClassDelete}
          show={confirmDeleteDialog}
          data={selectedClass}
        />
        <ModalImportClass
          titleHeader="Import Classes"
          onHandleImport={handleImportExcel}
          onHide={() => setModalImport(false)}
          show={modalImport}
        />
        <ExtendClassModal
          titleHeader="Import Classes"
          onUpdateClass={handleClassUpdate}
          onDeleteStudent={handleClassDelete}
          selectedClass={selectedClass}
          onHide={() => setModalExtendClass(false)}
          show={modalExtendClass}
        />
        <Row>
          <Col md="12">
            <Card className="striped-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Manage Class</Card.Title>
                <p className="card-category">
                  Showing{" "}
                  <span className="badge badge-primary">{totalCount}</span>{" "}
                  classes in the database
                </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-auto py-auto">
                <Row>
                  <Col>
                    <SearchBox value={searchQuery} onChange={handleSearch} />
                  </Col>
                  <Col>
                    {auth.getCurrentUser()?.role === "admin" && (
                      <React.Fragment>
                        <Button
                          className="btn-fill btn-wd"
                          variant="primary"
                          onClick={async () => {
                            await setSelectedClass({});
                            setModalShow(true);
                          }}
                        >
                          <i className="fas fa-plus-circle"></i> Create Class
                        </Button>
                        <Button
                          className="btn-fill btn-wd ml-2"
                          variant="success"
                          onClick={() => {
                            setModalImport(true);
                          }}
                        >
                          <i className="fas fa-file-import"></i> Import Class
                        </Button>
                      </React.Fragment>
                    )}
                  </Col>
                </Row>

                <LoadingPage isLoading={isLoading}>
                  {totalCount === 0 ? (
                    <p>Data empty</p>
                  ) : (
                    <>
                      <ClassTable
                        classes={newClasses}
                        sortColumn={sortColumn}
                        selectedData={selectedClass}
                        onShowConfirm={handleShowConfirmDialog}
                        onSort={handleSort}
                        onShowUpdate={handleShowUpdateDialog}
                        onShowExtendClassModal={handleShowExtendClassModal}
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

export default Classes;
