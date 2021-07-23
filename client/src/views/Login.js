import React from "react";
import { Redirect, useHistory } from "react-router-dom";

import {
  InteractionStatus,
  InteractionRequiredAuthError,
  EventType,
} from "@azure/msal-browser";

import { loginRequest } from "../configs/authConfig";
import { callMsGraph } from "../services/graphService";

import LoadingComponent from "react-spinners/ClipLoader";

import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";

import auth from "../services/authService";
import "../assets/css/login.css";
import "../assets/scss/login.scss";
import { toast } from "react-toastify";

const Login = () => {
  const { instance, inProgress, accounts } = useMsal();
  const history = useHistory();

  if (accounts.length > 0) {
    instance.setActiveAccount(accounts[0]);
  }

  React.useEffect(() => {
    if (inProgress === InteractionStatus.None && accounts.length > 0) {
      async function handleLogin() {
        try {
          const accessTokenResponse = await instance.acquireTokenSilent({
            ...loginRequest,
            account: instance.getActiveAccount(),
          });

          const response = await callMsGraph(accessTokenResponse.accessToken);
          await auth.login(response);
          history.replace("/register");
        } catch (error) {
          if (error instanceof InteractionRequiredAuthError) {
            instance.acquireTokenRedirect({
              ...loginRequest,
              account: accounts[0],
            });
          }
        }
      }
      handleLogin();
    }
  }, [instance, accounts, inProgress]);

  instance.addEventCallback(
    (event) => {
      if (
        event.eventType === EventType.LOGIN_SUCCESS &&
        event.payload.account
      ) {
        const account = event.payload.account;
        instance.setActiveAccount(account);
      }
    },
    (error) => {
      console.log(`error`, error);
    }
  );

  function loginPopup() {
    const account = instance.getActiveAccount();
    if (!account)
      instance.loginPopup(loginRequest).catch((err) => console.log(err));
  }

  return auth.getCurrentUser()?._id ? (
    <Redirect to="/" />
  ) : (
    <div className="auth-wrapper">
      <section className="container">
        <div className="span-1">
          <div className="login">
            <h1></h1>
            <div className="login-content">
              <AuthenticatedTemplate>
                <LoadingComponent color="#FFFFFF" size={20} />
              </AuthenticatedTemplate>
              <UnauthenticatedTemplate>
                <a
                  className="clickable button button--social-login button--microsoft"
                  onClick={loginPopup}
                >
                  <i className="icon fab fa-windows" />
                  Login With Microsoft
                </a>
              </UnauthenticatedTemplate>
            </div>
          </div>
        </div>
        <div className="span-2">
          <div className="message">
            <span className="first">Van Lang</span>
            <span className="second">26</span>
            <span className="third">QR-Code</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
