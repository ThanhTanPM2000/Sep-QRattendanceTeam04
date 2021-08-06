import React from "react";

import LoadingComponent from "react-spinners/ClipLoader";

import "../assets/css/registered.css";

const RegisteredAcc = ({ isRegistered }) => {
  const handleClick = (e) => {
    e.preventDefault();
    window.location = "/";
  };

  return (
    <div className="register">
      <div className="login">
        <h1></h1>
        <div className="login-content">
          {isRegistered ? (
            <>
              {/* <Button
              className="btn-fill btn-wd"
              size="lg"
              onClick={(e) => handleClick(e)}
            >
              Take Me Home
            </Button> */}
              <a
                className="clickable button button--social-login button--microsoft"
                onClick={(e) => handleClick(e)}
              >
                <i className="icon far fa-check-circle" />
                Success - Return Home
              </a>
            </>
          ) : (
            <LoadingComponent
              color="#FFFFFF"
              loading={!isRegistered}
              size={50}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisteredAcc;
