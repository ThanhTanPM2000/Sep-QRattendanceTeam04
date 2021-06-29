import { useEffect } from "react";
import { useHistory } from "react-router-dom";

import auth from "../services/authService";

const Logout = () => {
  const history = useHistory();

  useEffect(() => {
    auth.logout();
    history.replace("/login");
  });
  return null;
};

export default Logout;
