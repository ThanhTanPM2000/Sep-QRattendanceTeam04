import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.response.use(null, (err) => {
  const errorResponse =
    err.response && err.response.status >= 400 && err.response.status < 500;

  if (!errorResponse) {
    if (!err.status) {
      toast.error("Network Error");
    } else {
      toast.error("Unexpected error occur");
    }
  }

  return Promise.reject(err);
});

export function setJwt(jwt) {
  axios.defaults.headers.common["x-auth-token"] = jwt;
}

const http = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt,
};

export default http;
