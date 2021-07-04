import http from "./httpService";
import { apiUrl } from "../configs/config.json";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";

const apiEndpoint = apiUrl + "/auth";
const tokenKey = "token";

http.setJwt(getJwt());

async function login(data) {
  try {
    const { data: jwt } = await http.post(`${apiEndpoint}`, {
      name: data.displayName,
      mail: data.mail,
    });
    localStorage.setItem(tokenKey, jwt);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      toast.error("Data send invalid");
    }
  }
}

function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

function logout() {
  localStorage.removeItem(tokenKey);
}

function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (error) {
    return null;
  }
}

function getJwt() {
  return localStorage.getItem(tokenKey);
}

const auth = {
  login,
  loginWithJwt,
  logout,
  getCurrentUser,
  getJwt,
};

export default auth;
