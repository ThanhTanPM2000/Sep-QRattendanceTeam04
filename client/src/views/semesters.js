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
import { deleteSemester, getSemesters } from "../services/semesterService";
import { deleteSemesters } from "../services/semesterService";

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

function Semesters() {
  const [semestersList, setSemesters] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
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

  const handleSort = async (sortColumn) => {
    await setSortColumn(sortColumn);
  };

  const handleSearch = async (query) => {
    await setSearchQuery(query);
    await setCurrentPage(1);
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
                <SemesterTable
                  semesters={newSemesters}
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

export default Semesters;
