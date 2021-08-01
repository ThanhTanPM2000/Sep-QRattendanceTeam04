import React from "react";
import _ from "lodash";
import { toast } from "react-toastify";

import ClassService from "../services/classService";

import SearchBox from "../components/common/searchBox";
import Pagination from "../components/common/pagination";
import LoadingPage from "../components/common/loadingPage";
import { paginate } from "../utils/paginate";
import StudentForm from "./studentForm";
import StudentTable from "./studentTable";

import { Button, Card, Container, Row, Col } from "react-bootstrap";

import ModalForm from "components/common/modalForm";
import ModalImportStudent from "components/modalImportStudent";
import ModalConfirm from "components/common/modalConfirm";

const Students = ({ myClass, onUpdateStudent }) => {
  const [studentsList, setStudentList] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [pageSize, setPageSize] = React.useState(7);
  const [sortColumn, setSortColumn] = React.useState({
    path: "name",
    order: "asc",
  });
  const [selectedStudent, setSelectedStudent] = React.useState("");
  const [modalShow, setModalShow] = React.useState(false);
  const [modalImport, setModalImport] = React.useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = React.useState(false);

  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const students = myClass.lessons[0].students.map((x) => {
      return {
        name: x.name,
        mail: x.mail,
        studentId: x.studentId,
      };
    });
    setStudentList(students);
    setLoading(false);
  }, [myClass]);

  const handleShowConfirmDialog = (student) => {
    setSelectedStudent(student);
    setConfirmDeleteDialog(true);
  };

  const handleStudentDelete = async (student) => {
    const originalStudent = [...studentsList];

    // const newStudents = originalStudent.filter((m) => m.mail !== student.mail);
    // setStudentList(newStudents);

    try {
      const { data } = await ClassService.deleteStudentInClass(
        myClass,
        student
      );
      toast.success("Delete student out of Class Successfully");
      onUpdateStudent(data);
    } catch (error) {
      if (error.response && error.response.data === 404) {
        toast.error("This Student has already delete");
      } else if (error.response && error.response.status === 403) {
        toast.error("Access denied");
      } else {
        toast.error(error.response.data);
      }
      setStudentList(originalStudent);
    }
    setConfirmDeleteDialog(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleShowUpdateDialog = (student) => {
    setSelectedStudent(student);
    setModalShow(true);
  };

  const handleStudentsUpdate = (student) => {
    const students = student.lessons[0].students.map((x) => {
      return {
        name: x.name,
        mail: x.mail,
        studentId: x.studentId,
      };
    });
    setStudentList(students);

    setModalShow(false);
    onUpdateStudent(student);
  };

  const handleSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
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

  const handleImportExcel = (newStudent) => {
    const newStudents = [...studentsList, ...newStudent];
    setStudentList(newStudents);
  };

  const { totalCount, data: newStudents } = getPagedData();

  return (
    <Container fluid className="mt-3">
      <ModalForm
        titleHeader={!selectedStudent._id ? "Create User" : "Update User"}
        show={modalShow}
        onHide={() => setModalShow(false)}
      >
        <StudentForm
          onHide={() => setModalShow(false)}
          myClass={myClass}
          onUpdateStudent={handleStudentsUpdate}
          selectedStudent={selectedStudent}
        />
      </ModalForm>
      <ModalConfirm
        onHide={() => setConfirmDeleteDialog(false)}
        onDelete={handleStudentDelete}
        show={confirmDeleteDialog}
        data={selectedStudent}
      />
      <ModalImportStudent
        titleHeader="Import Student"
        onHandleImport={onUpdateStudent}
        myClass={myClass}
        onHide={() => setModalImport(false)}
        show={modalImport}
      />
      <Row>
        <Col md="12">
          <Card className="striped-tabled-with-hover ">
            <Card.Header>
              <Card.Title as="h4">Manage Student In Class</Card.Title>
              <p className="card-category">
                Showing{" "}
                <span className="badge badge-primary">{totalCount}</span>{" "}
                students in the class
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
                      setSelectedStudent({});
                      setModalShow(true);
                    }}
                  >
                    <i className="fas fa-plus-circle"></i> Add Student
                  </Button>
                  <Button
                    className="btn-fill btn-wd ml-2"
                    variant="success"
                    onClick={() => {
                      setModalImport(true);
                    }}
                  >
                    <i className="fas fa-file-import"></i> Import Student
                  </Button>
                </Col>
              </Row>
              <LoadingPage isLoading={isLoading}>
                {totalCount === 0 ? (
                  <p className="mt-3">No Students in Class, please add some</p>
                ) : (
                  <>
                    <StudentTable
                      students={newStudents}
                      sortColumn={sortColumn}
                      selectedData={selectedStudent}
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
  );
};

export default Students;
