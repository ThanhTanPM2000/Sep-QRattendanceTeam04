import http from "./httpService";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";

const apiEndpoint = "/auth";
const tokenKey = "token";

http.setJwt(getJwt());

async function login(data) {
  try {
    const { data: jwt } = await http.post(`${apiEndpoint}`, {
      name: data.displayName,
      mail: data.mail,
    });
    localStorage.setItem(tokenKey, jwt);
    http.setJwt(getJwt());
  } catch (error) {
    if (error.response.data) {
      toast.error(error.response.data);
      throw new Error();
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
