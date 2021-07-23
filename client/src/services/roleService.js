import http from "./httpService";

const apiEndpoint = "/roles";

function rolesUrl(id) {
  return `${apiEndpoint}/${id}`;
}

function getRoles() {
  return http.get(apiEndpoint);
}

function getRole(id) {
  return http.get(rolesUrl(id));
}

const RoleService = {
  getRoles,
  getRole,
};

export default RoleService;
