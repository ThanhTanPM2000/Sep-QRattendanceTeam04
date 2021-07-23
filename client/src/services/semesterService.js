import http from "./httpService";

const apiEndpoint = "/semesters";

function semesterUrl(id) {
  return `${apiEndpoint}/${id}`;
}

function getSemesters() {
  return http.get(apiEndpoint);
}

function getSemester(id) {
  return http.get(semesterUrl(id));
}

function saveSemester(semester) {
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

function deleteSemester(semester) {
  return http.delete(semesterUrl(semester._id));
}

const SemesterService = {
  getSemesters,
  getSemester,
  saveSemester,
  deleteSemester,
};

export default SemesterService;
