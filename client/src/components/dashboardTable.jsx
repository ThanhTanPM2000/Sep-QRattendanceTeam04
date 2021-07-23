import React from "react";

import { Link } from "react-router-dom";
import TableCommon from "./common/table";
import { Table } from "react-bootstrap";

import TableScrollbar from "react-table-scrollbar";
import { wrap } from "yargs";

const DashboardTable = ({ classes, sortColumn, onSort }) => {
  // const columns = [
  //   { path: "classTermId", label: "ClassTermId" },
  //   {
  //     path: "name",
  //     label: "DisplayName",
  //   },
  //   { path: "lessons[0].", label: "Lesson" },
  //   { path: "room", label: "Room" },
  //   { path: "lecturer.name", label: "Lecturer" },
  //   { path: "numOfStudents", label: "Num Students" },
  //   { path: "semester.name", label: "Semester" },
  //   { path: "semester.year", label: "Years" },
  // ];

  const renderLessonColumn = () => {
    var lessonsColumn = [];
    for (var i = 1; i <= 25; i++) {
      lessonsColumn.push(
        <th key={`lesson${i}`} style={{ minWidth: "100px" }}>
          Lesson {i}
        </th>
      );
    }

    return <>{lessonsColumn}</>;
  };

  return (
    // <TableCommon
    //   columns={columns}
    //   data={classes}
    //   sortColumn={sortColumn}
    //   onSort={onSort}
    // />
    // <TableScrollbar rows={10}>
    <div style={{ height: "500px", overflow: "auto" }}>
      <Table striped bordered hover size="sm">
        <thead className="thead-dark">
          <tr>
            <th className="border-0" key="classTermId">
              Class Term ID
            </th>
            <th
              className="border-0"
              key="className"
              style={{ width: "300px ", minWidth: "300px" }}
            >
              Class Name
            </th>
            {renderLessonColumn()}
          </tr>
        </thead>
        <tbody>
          {classes.map((item) => (
            <tr key={item._id}>
              <td key={`${item._id}classTermId`}>{item.classTermId}</td>
              <td key={`${item._id}className`} style={{ width: "300px" }}>
                {item.name}
              </td>
              {item.lessons.map((lesson) => (
                <td key={`${item._id}${lesson._id}`}>{`${
                  lesson.numOfAttendance
                }/${lesson.numOfNonAttendance + lesson.numOfAttendance}`}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
    // </TableScrollbar>
  );
};

export default DashboardTable;
