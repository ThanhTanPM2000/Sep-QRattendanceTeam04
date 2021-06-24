import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/faculties";

function facultiesUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getFaculties() {
  return http.get(apiEndpoint);
}

export function getFaculty(id) {
  return http.get(facultiesUrl(id));
}
