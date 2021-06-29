import React from "react";
import _ from "lodash";
import { toast } from "react-toastify";

import Pagination from "../components/common/pagination";
import SearchBox from "../components/common/searchBox";
import SemesterTable from "../components/semesterTable";
import LoadingPage from "../components/common/loadingPage";
import { paginate } from "../utils/paginate";
import { getSemesters } from "../services/semesterService";
import { deleteSemester } from "../services/semesterService";
import ModalConfirm from "components/common/modalConfirm";

// react-bootstrap components
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import ModalCommon from "components/common/modalCommon";
import SemesterForm from "./SemesterForm";

function Semesters() {
  const [semestersList, setSemesters] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [pageSize, setPageSize] = React.useState(10);
  const [sortColumn, setSortColumn] = React.useState({
    path: "year",
    order: "asc",
  });
  const [selectedSemester, setSelectedSemester] = React.useState({});
  const [modalShow, setModalShow] = React.useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = React.useState(false);

  React.useEffect(() => {
    async function getDataFromApi() {
      try {
        let { data: newSemesters } = await getSemesters();

        setSemesters(newSemesters);
      } catch (error) {
        console.log("hello");
      }
    }

    getDataFromApi();
  }, []);

  const handleShowConfirmDialog = (semester) => {
    setSelectedSemester(semester);
    setConfirmDeleteDialog(true);
  };

  const handleSemesterDelete = async (semester) => {
    const originalSemester = [...semestersList];

    const newSemesters = originalSemester.filter((m) => m._id !== semester._id);
    setSemesters(newSemesters);

    try {
      await deleteSemester(semester);
      toast.success("Delete semester successfully");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("This semester has already been deleted");
      } else if (error.response && error.response.status === 403) {
        toast.error("Access denied");
      }
      setSemesters(originalSemester);
    }
    setConfirmDeleteDialog(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleShowUpdateDialog = (semester) => {
    setSelectedSemester(semester);
    setModalShow(true);
  };

  const handleSemestersUpdate = (semester) => {
    let newSemesterList = [...semestersList];
    const semesterData = newSemesterList.find((x) => x._id === semester._id);
    if (semesterData) {
      newSemesterList.map((x) => {
        if (x._id === semester._id) {
          x.name = semester.name;
          x.year = semester.year;
          x.symbol = semester.symbol;
        }
      });
    } else {
      newSemesterList = [semester, ...semestersList];
    }
    setSemesters(newSemesterList);
    setModalShow(false);
  };

  const handleSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const getPagedData = () => {
    let filtered = semestersList;
    if (searchQuery) {
      filtered = semestersList.filter((x) =>
        x.name.toLowerCase().startsWith(searchQuery.toLowerCase())
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
        <ModalCommon
          titleHeader="Create Semester"
          show={modalShow}
          onHide={() => setModalShow(false)}
        >
          <SemesterForm
            onHide={() => setModalShow(false)}
            onUpdateSemesters={handleSemestersUpdate}
            selectedSemester={selectedSemester}
          />
        </ModalCommon>
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
              <Card.Body className="table-full-width table-responsive px-0">
                <LoadingPage data={semestersList}>
                  <Row>
                    <Col md="10" className="md-3">
                      <SearchBox value={searchQuery} onChange={handleSearch} />
                    </Col>
                    <Col>
                      <Button
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
                </LoadingPage>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Semesters;
