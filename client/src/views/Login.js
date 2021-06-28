import React from "react";
import { Button, Image } from "react-bootstrap";
import officeLogo from "../assets/img/officeLogo.png";

import "../assets/css/login.css";

const Login = () => {
  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form>
          <h3>Sign In</h3>
          <Button variant="danger" onClick={() => console.log("hello")}>
            <Image src={officeLogo} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
