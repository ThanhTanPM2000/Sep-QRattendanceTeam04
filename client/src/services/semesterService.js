import http from "./httpService";
import { apiUrl } from "../configs/config.json";

const apiEndpoint = apiUrl + "/semesters";

function semesterUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getSemesters() {
  return http.get(apiEndpoint);
}

export function getSemester(id) {
  return http.get(semesterUrl(id));
}

export function saveSemester(semester) {
  if (semester._id) {
    const body = { ...semester };
    delete body._id;
    return http.put(semesterUrl(semester._id), body);
  }
  return http.post(apiEndpoint, semester);
}

export function deleteSemester(semester) {
  return http.delete(semesterUrl(semester._id));
}
