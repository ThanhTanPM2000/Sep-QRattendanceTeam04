import { UnauthenticatedTemplate } from "@azure/msal-react";
import { useEffect } from "react";

import { useMsal } from "@azure/msal-react";

import auth from "../services/authService";

const Logout = () => {
  const { instance } = useMsal();

  useEffect(() => {
    instance
      .logoutRedirect({
        postLogoutRedirectUri: "/login",
        // mainWindowRedirectUri: "/login",
      })
      .then(() => {
        console.log("hello");
        auth.logout();
      })
      .catch((err) => console.log("heave err", err));
  });

  return <UnauthenticatedTemplate>{auth.logout()}</UnauthenticatedTemplate>;
};

export default Logout;
