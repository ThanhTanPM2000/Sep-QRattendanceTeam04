import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/users";

function userUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export async function getUsers() {
  try {
    const response = await http.get(apiEndpoint);
    return response;
  } catch (error) {}
}

export function getUser(id) {
  return http.get(movieUrl(id));
}

export function saveUser(user) {
  if (user._id) {
    const body = { ...user };
    delete body._id;
    return http.put(userUrl(user._id), body);
  }
  return http.post(apiEndpoint, user);
}

export function deleteUser(user) {
  return http.delete(userUrl(user._id));
}
