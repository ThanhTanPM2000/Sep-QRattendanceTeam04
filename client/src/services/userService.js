import http from "./httpService";

const apiEndpoint = "/users";

function userUrl(id) {
  return `${apiEndpoint}/${id}`;
}

function getUsers() {
  return http.get(apiEndpoint);
}

function getUser() {
  return http.get(`${apiEndpoint}/me`);
}

function saveUser(user) {
  if (user._id) {
    const body = { ...user };
    delete body._id;
    return http.put(userUrl(user._id), body);
  }
  return http.post(apiEndpoint, user);
}

function deleteUser(user) {
  return http.delete(userUrl(user._id));
}

const UserService = {
  getUsers,
  getUser,
  saveUser,
  deleteUser,
};

export default UserService;
