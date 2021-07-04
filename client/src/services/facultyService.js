import http from "./httpService";
import { apiUrl } from "../configs/config.json";

const apiEndpoint = apiUrl + "/faculties";

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
