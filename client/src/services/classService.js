import http from "./httpService";

const apiEndpoint = "/classes";

function classesUrl(id) {
  return `${apiEndpoint}/${id}`;
}

async function getClasses() {
  try {
    const response = await http.get(apiEndpoint);
    return response;
  } catch (error) {}
}

function getClass(id) {
  return http.get(classesUrl(id));
}

function saveClass(_class) {
  if (_class._id) {
    const body = { ..._class };
    delete body._id;
    return http.put(classesUrl(_class._id), body);
  }
  return http.post(apiEndpoint, _class);
}

function deleteClass(_class) {
  return http.delete(classesUrl(_class._id));
}

function saveStudentInClass(_class, student) {
  if (student.name !== "Student not login yet") {
    console.log(student);
    return http.put(`${apiEndpoint}/${_class._id}/${student.mail}`, student);
  }
  return http.post(`${apiEndpoint}/${_class._id}`, student);
}

function deleteStudentInClass(_class, student) {
  return http.delete(`${apiEndpoint}/${_class._id}/${student.mail}`);
}

// function attendanceInClass_()

const ClassService = {
  saveStudentInClass,
  deleteStudentInClass,
  getClass,
  getClasses,
  saveClass,
  deleteClass,
};

export default ClassService;
