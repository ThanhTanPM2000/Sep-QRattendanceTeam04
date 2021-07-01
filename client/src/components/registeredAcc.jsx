import React from "react";

import LoadingComponent from "react-spinners/ClipLoader";

import { Button } from "react-bootstrap";
import { Redirect, useHistory } from "react-router-dom";

const RegisteredAcc = ({ isRegistered }) => {
  const history = useHistory();

  const handleClick = (e) => {
    e.preventDefault();
    window.location = "/";
  };

  return (
    <div className="register">
      <div className="form-container">
        {isRegistered ? (
          <>
            <div className="icon-box">
              <i className="nc-icon nc-simple-remove">&#xE5CD;</i>
            </div>
            <Button
              className="btn-fill btn-wd"
              size="lg"
              onClick={(e) => handleClick(e)}
            >
              Take Me Home
            </Button>
          </>
        ) : (
          <LoadingComponent color="#D0021B" loading={!isRegistered} size={50} />
        )}
      </div>
    </div>
  );
};

export default RegisteredAcc;
