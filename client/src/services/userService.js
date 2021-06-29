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
  let response;

  if (user._id) {
    const body = { ...user };
    delete body._id;
    response = http.put(userUrl(user._id), body);
    toast.success("Update successfully");
    return response;
  }
  response = http.post(apiEndpoint, user);
  toast.success("Create successfully");
  return response;
}

export function deleteUser(user) {
  return http.delete(userUrl(user._id));
}
