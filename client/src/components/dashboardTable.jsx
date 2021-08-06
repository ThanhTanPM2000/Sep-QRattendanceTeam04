import React from "react";

import { Table } from "react-bootstrap";

const DashboardTable = ({ classes, searchQueryStudent }) => {
  const renderLessonColumn = () => {
    var lessonsColumn = [];
    for (var i = 1; i <= 25; i++) {
      lessonsColumn.push(
        <th
          key={`lesson${i}`}
          style={{ minWidth: "100px" }}
        >{`Lesson ${i}`}</th>
      );
    }

    return lessonsColumn;
  };

  return (
    <div style={{ height: "500px", overflow: "auto" }}>
      <Table striped bordered hover size="sm">
        <thead className="thead-dark">
          <tr>
            <th className="border-0" key="semesterId">
              SemesterID
            </th>
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
            {searchQueryStudent && (
              <th className="border-0" key="studentMail">
                Student mail
              </th>
            )}
            {renderLessonColumn().map((element) => element)}
            {/* {renderLessonColumn()} */}
          </tr>
        </thead>
        <tbody>
          {classes.map((item) => (
            <tr key={item._id}>
              <td key={`${item._id}semesterId`}>{item.semester.symbol}</td>
              <td key={`${item._id}classTermId`}>{item.classTermId}</td>
              <td key={`${item._id}className`} style={{ width: "300px" }}>
                {item.name}
              </td>
              {searchQueryStudent && (
                <td key={`${item._id}studentMail`} style={{ width: "300px" }}>
                  {
                    item.lessons[0].students.filter((x) =>
                      x.mail
                        .toLowerCase()
                        .startsWith(searchQueryStudent.toLowerCase())
                    )[0].mail
                  }
                </td>
              )}
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
