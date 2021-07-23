import http from "./httpService";

const apiEndpoint = "/faculties";

function facultiesUrl(id) {
  return `${apiEndpoint}/${id}`;
}

function getFaculties() {
  return http.get(apiEndpoint);
}

function getFaculty(id) {
  return http.get(facultiesUrl(id));
}

const FacultyService = {
  getFaculties,
  getFaculty,
};

export default FacultyService;
