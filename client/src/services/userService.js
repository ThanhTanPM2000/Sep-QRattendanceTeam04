import { toast } from "react-toastify";

import http from "./httpService";
import { apiUrl } from "../configs/config.json";

const apiEndpoint = apiUrl + "/users";

function userUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getUsers() {
  return http.get(apiEndpoint);
}

export function getUser(id) {
  return http.get(userUrl(id));
}

export function saveUser(user) {
  console.log("here is user you want", user);
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
