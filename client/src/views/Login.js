import React from "react";
import { Button, Image } from "react-bootstrap";

import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";

import { loginRequest } from "../authConfig";
import { callMsGraph } from "../graph";

import officeLogo from "../assets/img/officeLogo.png";
import auth from "../services/authService";
import "../assets/css/login.css";

const Login = () => {
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = React.useState(null);

  async function RequestProfileData() {
    await instance.loginRedirect(loginRequest).catch((e) => {
      console.log(e);
    });

    const token = await instance.acquireTokenSilent({
      ...loginRequest,
      account: accounts[0],
    });
    const secureData = await callMsGraph(token.accessToken);
    setGraphData(secureData);
  }

  const handleLogin = async () => {
    try {
      const { username, password } = this.state.data;
      await auth.login(username, password);

      const { state } = this.props.location;
      window.location = state ? state.from.pathname : "/";
    } catch (error) {
      const errors = { ...this.state.errors };
      errors.username = error.response.data;
      this.setState({ errors });
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form>
          <h3>Sign In</h3>
          <Button variant="danger" onClick={RequestProfileData}>
            <Image src={officeLogo} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
