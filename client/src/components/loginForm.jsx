import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { callMsGraph } from "../graph";
import { Redirect, Link } from "react-router-dom";

import auth from "../services/authService";

const LoginForm = () => {
  const { instance, accounts } = useMsal();

  const doSubmit = async () => {
    try {
      await instance.loginPopup(loginRequest);
      const response = await instance.acquireTokenPopup({
        ...loginRequest,
        account: accounts[0],
      });
      const result = await callMsGraph(response.accessToken);
      await auth.login(result);
    } catch (error) {
      if (error.response && error.response.status === 405) {
        console.log(error);
      }
    }
  };

  return (
    <div className="auth-wrapper auth-inner">
      <h1>Login</h1>
      <button onClick={() => doSubmit()}>Sign in </button>
    </div>
  );
};

export default LoginForm;
