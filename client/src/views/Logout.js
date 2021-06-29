import { useEffect } from "react";

import { useMsal } from "@azure/msal-react";

import auth from "../services/authService";

const Logout = () => {
  const { instance } = useMsal();

  useEffect(() => {
    instance
      .logoutPopup({
        postLogoutRedirectUri: "/login",
        mainWindowRedirectUri: "/login",
      })
      .then(() => auth.logout())
      .catch((err) => console.log("err", err));
  }, []);

  return null;
};

export default Logout;
