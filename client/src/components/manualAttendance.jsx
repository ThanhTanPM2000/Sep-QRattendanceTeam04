import React from "react";
import _ from "lodash";
import { toast } from "react-toastify";

import SearchBox from "../components/common/searchBox";
import Pagination from "../components/common/pagination";
import LoadingPage from "../components/common/loadingPage";
import { paginate } from "../utils/paginate";

import LessonService from "services/lessonService";
import ClassService from "services/classService";

import { Button, Card, Container, Row, Col } from "react-bootstrap";
import ManualAttendanceTable from "./manualAttendanceTable";

const ManualAttendance = ({ myClass, lesson, show, onUpdateClass }) => {
  const [studentsList, setStudentList] = React.useState([
    ...myClass.lessons[lesson.order - 1].students,
  ]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [pageSize, setPageSize] = React.useState(7);
  const [sortColumn, setSortColumn] = React.useState({
    path: "status",
    order: "desc",
  });

  const [isLoading, setLoading] = React.useState(true);
  const [isHandling, setIsHandling] = React.useState(false);

  React.useEffect(() => {
    setLoading(false);
    if (show) {
      let timer1 = setInterval(async () => {
        const { data: newClass } = await ClassService.getClass(myClass._id);
        const students = newClass.lessons[lesson.order - 1].students;
        setStudentList(students);

        if (!_.isEqual(newClass, myClass)) {
          onUpdateClass(newClass);
        }
      }, 1000);

      return () => {
        clearTimeout(timer1);
      };
    }
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleManualAttendance = async (student) => {
    try {
      setIsHandling(true);
      const { data: newClass } = await LessonService.takeAttendance(
        myClass,
        lesson,
        student.mail
      );

      onUpdateClass(newClass);

      setIsHandling(false);
    } catch (error) {
      toast.error(error.response?.data);
    }
  };

  const getPagedData = () => {
    let filtered = studentsList;
    if (searchQuery) {
      console.log(studentsList);
      filtered = studentsList.filter(
        (x) =>
          x.mail.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          x.name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          x.studentId.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const students = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: students };
  };

  const { totalCount, data: newStudents } = getPagedData();

  return (
    <Container fluid className="mt-3">
      <Row>
        <Col md="12">
          <Card className="striped-tabled-with-hover ">
            <Card.Header>
              <Card.Title as="h4">
                Attendance student in {lesson.name}
              </Card.Title>
              <p className="card-category">
                Showing{" "}
                <span className="badge badge-primary">{totalCount}</span>{" "}
                students in the {lesson?.name}
              </p>
            </Card.Header>
            <Card.Body className="table-full-width table-responsive px-auto py-auto">
              <SearchBox value={searchQuery} onChange={handleSearch} />
              <LoadingPage isLoading={isLoading}>
                {totalCount === 0 ? (
                  <p className="mt-3">No Students in Class, please add some</p>
                ) : (
                  <>
                    <ManualAttendanceTable
                      students={newStudents}
                      sortColumn={sortColumn}
                      isHandling={isHandling}
                      onManualAttendance={handleManualAttendance}
                      onSort={handleSort}
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
  );
};

export default ManualAttendance;
