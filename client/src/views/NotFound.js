import React from "react";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import "../assets/css/notFound.css";

const NotFound = () => {
  const history = useHistory();

  function handleClick(e, goto) {
    e.preventDefault();

    if (goto === "home") {
      history.push("/");
    } else {
      alert("this feature is in developed");
    }
  }

  return (
    <div className="not-found">
      <div className="form-container">
        <div className="row">
          <div className="col-md-12">
            <div className="error-template">
              <h1>Oops!</h1>
              <h2>404 Not Found</h2>
              <div className="error-details">
                Sorry, an error has occured, Requested page not found!
              </div>
              <div className="error-actions">
                <Button
                  className="btn-fill btn-wd"
                  size="lg"
                  onClick={(e) => handleClick(e, "home")}
                >
                  Take Me Home
                </Button>
                <Button
                  className="btn-fill btn-wd"
                  variant="secondary"
                  size="lg"
                  onClick={() => handleClick("contact")}
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
