import React from "react";
import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";
import TableCommon from "./common/table";

const LessonTable = ({
  lessons,
  sortColumn,
  onAttendance,
  onSort,
  onResetLesson,
}) => {
  const columns = [
    { path: "name", label: "Lesson name" },
    {
      path: "numOfAttendance",
      label: "Number took Attendance",
    },
    { path: "numOfNonAttendance", label: "Number not Attendance" },
    { path: "status", label: "Status" },
    {
      key: "attendance",
      content: (lesson) => (
        <OverlayTrigger
          overlay={<Tooltip id="tooltip-537440761">Attendance..</Tooltip>}
        >
          <Button
            className="btn-fill btn-wd"
            type="button"
            variant="info"
            onClick={() => onAttendance(lesson)}
          >
            Attendance
          </Button>
        </OverlayTrigger>
      ),
    },
    {
      key: "reset",
      content: (lesson) => (
        <OverlayTrigger
          overlay={<Tooltip id="tooltip-537440761">Reset..</Tooltip>}
        >
          <Button
            className="btn-fill btn-wd"
            type="button"
            variant="danger"
            onClick={() => onResetLesson(lesson)}
          >
            Reset
          </Button>
        </OverlayTrigger>
      ),
    },
  ];

  return (
    <TableCommon
      columns={columns}
      data={lessons}
      sortColumn={sortColumn}
      onSort={onSort}
    />
  );
};

export default LessonTable;
