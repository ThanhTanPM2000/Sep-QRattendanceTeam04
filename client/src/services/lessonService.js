import http from "./httpService";

const apiEndpoint = "/lessons";

function saveQrCode(_class, lesson, qrCode, expiredTime) {
  return http.post(`${apiEndpoint}/${_class._id}/${lesson.order}`, {
    qrCode,
    expiredTime,
  });
}

function resetLesson(_class, lesson) {
  return http.put(`${apiEndpoint}/reset/${_class._id}/${lesson.order}`);
}

function takeAttendance(_class, lesson, mail) {
  return http.put(`${apiEndpoint}/${_class._id}/${lesson.order}`, {
    mail,
  });
}

const LessonService = {
  saveQrCode,
  takeAttendance,
  resetLesson,
};

export default LessonService;
