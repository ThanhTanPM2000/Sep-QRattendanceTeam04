import http from "./httpService";
import { apiUrl } from "../configs/config.json";

const apiEndpoint = apiUrl + "/classes";

function classesUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export async function getClasses() {
  try {
    const response = await http.get(apiEndpoint);
    return response;
  } catch (error) {}
}

export function getClass(id) {
  return http.get(ClassesUrl(id));
}

export function saveClass(_class) {
  if (_class._id) {
    const body = { ..._class };
    delete body._id;
    return http.put(classesUrl(_class._id), body);
  }
  return http.post(apiEndpoint, _class);
}

export function deleteClass(_class) {
  return http.delete(classUrl(_class._id));
}
