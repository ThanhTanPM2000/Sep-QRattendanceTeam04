import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { Button, Image } from "react-bootstrap";
import LoadingComponent from "react-spinners/ClipLoader";
import {
  InteractionStatus,
  InteractionRequiredAuthError,
  EventType,
} from "@azure/msal-browser";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useIsAuthenticated,
  useMsal,
} from "@azure/msal-react";

import { loginRequest } from "../configs/authConfig";
import { callMsGraph } from "../services/graphService";
import officeLogo from "../assets/img/officeLogo.png";
import auth from "../services/authService";
import "../assets/css/login.css";

const Login = ({ data }) => {
  const { instance, inProgress, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const history = useHistory();

  if (accounts.length > 0) {
    instance.setActiveAccount(accounts[0]);
  }

  React.useEffect(() => {
    if (!data && isAuthenticated && inProgress === InteractionStatus.None) {
      async function handleLogin() {
        try {
          const accessTokenResponse = await instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0],
          });
          console.log(accessTokenResponse.idToken);

          const response = await callMsGraph(accessTokenResponse.idToken);
          await auth.login(response);
          history.replace("/");
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
  }, [instance, accounts, inProgress, data]);

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

  if (data) return <Redirect to="/" />;

  return (
    <React.Fragment>
      <div className="auth-wrapper">
        <div className="auth-inner">
          <form>
            <AuthenticatedTemplate>
              <LoadingComponent color="#D0021B" size={50} />
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
              <h3>Sign In</h3>
              <Button variant="danger" onClick={loginPopup}>
                <Image src={officeLogo} />
              </Button>
            </UnauthenticatedTemplate>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Login;
