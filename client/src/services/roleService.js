import http from "./httpService";
import { apiUrl } from "../configs/config.json";

const apiEndpoint = apiUrl + "/roles";

function rolesUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getRoles() {
  return http.get(apiEndpoint);
}

export function getRole(id) {
  return http.get(rolesUrl(id));
}
