import { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { useMsal } from "@azure/msal-react";

import auth from "../services/authService";

const Logout = () => {
  const history = useHistory();
  const { instance } = useMsal();

  useEffect(() => {
    auth.logout();
    instance.logoutPopup({
      postLogoutRedirectUri: "/login",
      mainWindowRedirectUri: "/login",
    });
    // history.replace("/login");
  });

  return null;
};

export default Logout;
