import React from "react";
import _ from "lodash";
import { toast } from "react-toastify";

import Pagination from "../components/common/pagination";
import SearchBox from "../components/common/searchBox";
import SemesterTable from "../components/semesterTable";
import { paginate } from "../utils/paginate";
import SemesterService from "../services/semesterService";
import ModalConfirm from "../components/common/modalConfirm";

import LoadingPage from "../components/common/loadingPage";

// react-bootstrap components
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import ModalForm from "../components/common/modalForm";
import SemesterForm from "../components/semesterForm";

import { SocketContext } from "../services/socketIo";

function Semesters() {
  const [semestersList, setSemesters] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [pageSize] = React.useState(10);
  const [sortColumn, setSortColumn] = React.useState({
    path: "lastUpdated",
    order: "desc",
  });
  const [selectedSemester, setSelectedSemester] = React.useState({});
  const [modalShow, setModalShow] = React.useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = React.useState(false);

  const [isLoading, setLoading] = React.useState(true);

  const socket = React.useContext(SocketContext);

  React.useEffect(() => {
    async function getDataFromApi() {
      try {
        let { data: newSemesters } = await SemesterService.getSemesters();

        setLoading(false);
        setSemesters(newSemesters);
      } catch (error) {
        toast.error(error?.response?.data);
      }
    }

    getDataFromApi();

    socket.on("getNewSemesters", (semesters) => {
      setSemesters(semesters);
    });

    socket.on("deleteSemester", (semesters) => {
      setSemesters(semesters);
      setModalShow(false);
      setConfirmDeleteDialog(false);
    });
  }, [socket]);

  const handleShowConfirmDialog = React.useCallback((semester) => {
    setSelectedSemester(semester);
    setConfirmDeleteDialog(true);
  }, []);

  const handleSemesterDelete = async (semester) => {
    const originalSemester = [...semestersList];

    const newSemesters = originalSemester.filter((m) => m._id !== semester._id);
    setSemesters(newSemesters);

    try {
      await SemesterService.deleteSemester(semester);
      toast.success("Delete semester successfully");
    } catch (error) {
      toast.error(error.response?.data);

      setSemesters(originalSemester);
    }
    setConfirmDeleteDialog(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleShowUpdateDialog = React.useCallback((semester) => {
    setSelectedSemester(semester);
    setModalShow(true);
  }, []);

  const handleSemestersUpdate = (semester) => {
    setModalShow(false);
  };

  const handleSort = React.useCallback((sortColumn) => {
    setSortColumn(sortColumn);
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const getPagedData = () => {
    let filtered = semestersList;
    if (searchQuery) {
      filtered = semestersList.filter(
        (x) =>
          x.year.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          x.name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          x.symbol.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const semesters = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: semesters };
  };

  const { totalCount, data: newSemesters } = getPagedData();

  return (
    <>
      <Container fluid>
        <ModalForm
          titleHeader={
            !selectedSemester._id ? "Create Semester" : "Update Semester"
          }
          show={modalShow}
          onHide={() => setModalShow(false)}
        >
          <SemesterForm
            onHide={() => setModalShow(false)}
            onUpdateSemesters={handleSemestersUpdate}
            selectedSemester={selectedSemester}
          />
        </ModalForm>
        <ModalConfirm
          onHide={() => setConfirmDeleteDialog(false)}
          onDelete={handleSemesterDelete}
          show={confirmDeleteDialog}
          data={selectedSemester}
        />
        <Row>
          <Col md="12">
            <Card className="striped-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Manage Semesters</Card.Title>
                <p className="card-category">
                  Showing{" "}
                  <span className="badge badge-primary">{totalCount}</span>{" "}
                  semesters in the database
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
                        setSelectedSemester({});
                        setModalShow(true);
                      }}
                    >
                      <i className="fas fa-plus-circle"></i> Create Semester
                    </Button>
                  </Col>
                </Row>

                <LoadingPage isLoading={isLoading}>
                  {totalCount === 0 ? (
                    <p>Data empty</p>
                  ) : (
                    <>
                      <SemesterTable
                        semesters={newSemesters}
                        sortColumn={sortColumn}
                        selectedData={selectedSemester}
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

export default React.memo(Semesters);
