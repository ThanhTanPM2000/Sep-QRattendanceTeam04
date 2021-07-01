import http from "./httpService";
import { apiUrl } from "../configs/config.json";

import { toast } from "react-toastify";

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
  let response;
  const body = {
    year: `${semester.startYear}-${semester.endYear}`,
    name: semester.name,
    symbol: semester.symbol,
  };
  if (semester._id) {
    response = http.put(semesterUrl(semester._id), body);
    return response;
  }
  response = http.post(apiEndpoint, body);
  return response;
}

export function deleteSemester(semester) {
  return http.delete(semesterUrl(semester._id));
}
