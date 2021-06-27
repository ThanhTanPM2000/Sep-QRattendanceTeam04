import React from "react";
import _ from "lodash";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import Pagination from "../components/common/pagination";
import ListGroup from "../components/common/listGroup";
import SearchBox from "../components/common/searchBox";
import SemesterTable from "../components/semesterTable";
import LoadingPage from "../components/loadingPage";
import { paginate } from "../utils/paginate";
import { getSemesters } from "../services/semesterService";
import { deleteSemester } from "../services/semesterService";

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
import SemesterForm from "./SemesterForm";

function Semesters() {
  const [semestersList, setSemesters] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [pageSize, setPageSize] = React.useState(4);
  const [sortColumn, setSortColumn] = React.useState({
    path: "name",
    order: "asc",
  });
  const [selectedSemester, setSelectedSemester] = React.useState({});
  const [modalShow, setModalShow] = React.useState(false);

  React.useEffect(() => {
    async function getDataFromApi() {
      try {
        // let { data: newFaculties } = await getFaculties();
        // newFaculties = [selectedFaculty, ...newFaculties];

        // let { data: newRoles } = await getRoles();
        // newRoles = [selectedRole, ...newRoles];

        let { data: newSemesters } = await getSemesters();

        setSemesters(newSemesters);
        // setFaculties(newFaculties);
        // setRoles(newRoles);
      } catch (error) {
        console.log("hello");
      }
    }

    getDataFromApi();
  }, []);

  const handleDelete = async (semester) => {
    const originalSemester = [...semestersList];

    const newSemesters = originalSemester.filter((m) => m._id !== semester._id);
    setSemesters(newSemesters);

    try {
      await deleteSemester(semester);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("This semester has already been deleted");
      } else if (error.response && error.response.status === 403) {
        toast.error("Access denied");
      }
      setSemesters(originalSemester);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSemesterSelect = (semester) => {
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
        <Row>
          <Col md="12">
            <Card className="card-plain table-plain-bg">
              <Card.Header>
                <Row>
                  <Col md="10">
                    <Card.Title as="h4">Table on Plain Background</Card.Title>
                    <p className="card-category">
                      Showing{" "}
                      <span className="badge badge-primary">{totalCount}</span>{" "}
                      semesters in the database
                    </p>
                  </Col>

                  <Col md="2">
                    <Button
                      onClick={() => {
                        setSelectedSemester({});
                        setModalShow(true);
                      }}
                      variant="primary"
                      style={{ marginBottom: 20, width: 170, marginLeft: -50 }}
                    >
                      Create Semester
                    </Button>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <LoadingPage data={semestersList}>
                  <SearchBox value={searchQuery} onChange={handleSearch} />
                  <SemesterTable
                    semesters={newSemesters}
                    sortColumn={sortColumn}
                    onDelete={handleDelete}
                    onSort={handleSort}
                    onSelectedSemester={handleSemesterSelect}
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
