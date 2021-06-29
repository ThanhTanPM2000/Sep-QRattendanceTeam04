import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { Button, Image } from "react-bootstrap";

import { InteractionStatus } from "@azure/msal-browser";

import { useMsal } from "@azure/msal-react";

import { loginRequest } from "../configs/authConfig";
import { callMsGraph } from "../services/graphService";

import officeLogo from "../assets/img/officeLogo.png";
import auth from "../services/authService";
import "../assets/css/login.css";

const Login = ({ data }) => {
  const { instance, inProgress, accounts } = useMsal();
  const history = useHistory();

  React.useEffect(() => {
    if (!data && inProgress === InteractionStatus.None) {
      async function handleLogin() {
        try {
          // await instance.loginPopup(loginRequest);
          const accessTokenResponse = await instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0],
          });

          const response = await callMsGraph(accessTokenResponse.accessToken);
          await auth.login(response);
          history.replace("/");
        } catch (error) {
          console.log(error);
        }
      }

      handleLogin();
    }
  }, [instance, accounts, inProgress, data]);

  if (data) return <Redirect to="/" />;

  return (
    <React.Fragment>
      <div className="auth-wrapper">
        <div className="auth-inner">
          <form>
            <h3>Sign In</h3>
            <Button
              variant="danger"
              onClick={() => instance.loginPopup(loginRequest)}
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
