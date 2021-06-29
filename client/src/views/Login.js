import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { Button, Image } from "react-bootstrap";

import { InteractionRequiredAuthError } from "@azure/msal-browser";

import { useMsal } from "@azure/msal-react";

import { loginRequest } from "../configs/authConfig";
import { callMsGraph } from "../services/graphService";

import officeLogo from "../assets/img/officeLogo.png";
import auth from "../services/authService";
import "../assets/css/login.css";

const Login = ({ data }) => {
  const { instance, inProgress, accounts } = useMsal();
  const history = useHistory();

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

  async function handleLogin() {
    try {
      await instance.loginPopup(loginRequest);
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

  if (data) return <Redirect to="" />;

  return (
    <React.Fragment>
      <div className="auth-wrapper">
        <div className="auth-inner">
          <form>
            <h3>Sign In</h3>
            <Button variant="danger" onClick={handleLogin}>
              <Image src={officeLogo} />
            </Button>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Login;
