import React from "react";

import LessonTable from "./lessonTable";

import TableScrollbar from "react-table-scrollbar";

import LessonService from "services/lessonService";

import AttendanceModal from "./attendanceModal";
import { toast } from "react-toastify";

const Lesson = ({ myClass, onUpdateClass }) => {
  const [lessons, setLessons] = React.useState([]);
  const [sortColumn, setSortColumn] = React.useState({
    path: "name",
    order: "asc",
  });
  const [selectedLesson, setSelectedLesson] = React.useState();
  const [isAttendance, setIsAttendance] = React.useState(false);

  const handleSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };

  React.useEffect(() => {
    const lessons = myClass.lessons;
    setLessons(lessons);
  }, [myClass]);

  const handleAttendance = (lesson) => {
    setIsAttendance(true);
    setSelectedLesson(lesson);
  };

  const handleResetLesson = async (lesson) => {
    try {
      LessonService.resetLesson(myClass, lesson);
      toast.success(`Reset ${lesson.name} successfully`);
    } catch (error) {
      toast.error(error?.response?.data);
    }
  };

  return (
    <React.Fragment>
      <AttendanceModal
        myClass={myClass}
        selectedLesson={selectedLesson}
        onUpdateClass={onUpdateClass}
        show={isAttendance}
        onHide={() => setIsAttendance(false)}
      />
      <TableScrollbar rows={13}>
        <LessonTable
          lessons={lessons}
          sortColumn={sortColumn}
          onAttendance={handleAttendance}
          onResetLesson={handleResetLesson}
          selectedData={selectedLesson}
          onSort={handleSort}
        />
      </TableScrollbar>
    </React.Fragment>
  );
};

export default Lesson;
