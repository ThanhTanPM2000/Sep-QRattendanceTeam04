import React from "react";

import { Button } from "react-bootstrap";

const confirm = ({ data, faculties, roles, nextStep, prevStep }) => {
  const { userId, name, mail, degree, facultyId, roleId } = data;

  const handleBack = (e) => {
    e.preventDefault();
    prevStep();
  };

  return (
    <div className="register">
      <div className="form-container">
        <h1 className="mb-5">Confirm</h1>
        <ul className="list-group">
          <li className="list-group-item">UserId: {userId}</li>
          <li className="list-group-item">Display Name: {name}</li>
          <li className="list-group-item">Email Address: {mail}</li>
          <li className="list-group-item">Degree: {degree}</li>
          <li className="list-group-item">
            Faculty: {faculties.find((x) => x._id === facultyId)["name"]}{" "}
          </li>
          <li className="list-group-item">
            Role: {roles.find((x) => x._id === roleId)["name"]}{" "}
          </li>
        </ul>

        <br />
        <br />

        <div className="row">
          <div className="col-6">
            <Button
              className="btn-fill btn-wd"
              variant="danger"
              onClick={(e) => handleBack(e)}
            >
              Back
            </Button>
          </div>
          <div className="col-6 text-right">
            <Button
              className="btn-fill btn-wd"
              variant="primary"
              onClick={(e) => nextStep(e)}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default confirm;
