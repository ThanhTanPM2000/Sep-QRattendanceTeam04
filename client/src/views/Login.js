import React from "react";
import { Redirect } from "react-router-dom";
import { Button, Image } from "react-bootstrap";

import {
  InteractionRequiredAuthError,
  InteractionStatus,
  InteractionType,
} from "@azure/msal-browser";

import {
  MsalAuthenticationTemplate,
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";

import { loginRequest } from "../configs/authConfig";
import { callMsGraph } from "../services/graphService";

import officeLogo from "../assets/img/officeLogo.png";
import auth from "../services/authService";
import "../assets/css/login.css";
import { useState } from "react";

const Login = () => {
  const { instance, inProgress, accounts } = useMsal();
  const [user, setUser] = useState();

  React.useEffect(() => {
    const newUser = auth.getCurrentUser();
    setUser(newUser);
  }, []);

  // React.useEffect(() => {
  //   if (!user && inProgress === InteractionStatus.None) {
  //     async function RequestProfileData() {
  //       try {
  //         const token = await instance.acquireTokenSilent({
  //           ...loginRequest,
  //           account: accounts[0],
  //         });
  //         const secureData = await callMsGraph(token.accessToken);
  //         await auth.login(secureData);
  //         window.location = "/";
  //       } catch (error) {
  //         if (error instanceof InteractionRequiredAuthError) {
  //           instance.acquireTokenRedirect({
  //             ...loginRequest,
  //             account: accounts[0],
  //           });
  //         }
  //       }
  //     }
  //     RequestProfileData();
  //   }
  // }, [instance, accounts, inProgress, user]);

  const RequestProfileData = async () => {
    try {
      await instance.loginPopup(loginRequest);
      const token = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });
      const secureData = await callMsGraph(token.accessToken);
      await auth.login(secureData);
      window.location = "/";
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        instance.acquireTokenRedirect({
          ...loginRequest,
          account: accounts[0],
        });
      }
    }
  };

  if (auth.getCurrentUser()) return <Redirect to="" />;

  return (
    <React.Fragment>
      <div className="auth-wrapper">
        <div className="auth-inner">
          <form>
            <h3>Sign In</h3>
            <Button
              variant="danger"
              onClick={() => {
                RequestProfileData();
              }}
            >
              <Image src={officeLogo} />
            </Button>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Login;
