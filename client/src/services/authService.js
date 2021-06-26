import http from "./httpService";
import { apiUrl } from "../config.json";
import jwtDecode from "jwt-decode";
import { Redirect } from "react-router-dom";

const apiEndpoint = apiUrl + "/auth";
const tokenKey = "token";

http.setJwt(getJwt());

export async function login(data) {
  // const { data: jwt } = await http.post(`${apiEndpoint}`, {
  //   name: data.displayName,
  //   mail: data.mail,
  // });

  http
    .post(`${apiEndpoint}`, {
      name: data.displayName,
      mail: data.mail,
    })
    .then((res) => {
      if (res.data === "register") {
        return <Redirect to="/register" />;
      } else {
        const { data: jwt } = res;
        console.log("jwt", jwt);
      }
    });

  // localStorage.setItem(tokenKey, jwt);
}

export function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

export function logout() {
  localStorage.removeItem(tokenKey);
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (error) {
    return null;
  }
}

export function getJwt() {
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
