import React from "react";

import { Table, Button, Form } from "react-bootstrap";

const UserTerm = ({ renderSelect, roles, nextStep, prevStep }) => {
  const [isCheck, setIsCheckBox] = React.useState(false);

  const handleCheck = () => {
    setIsCheckBox(!isCheck);
  };

  const handleContinue = (e) => {
    e.preventDefault();
    nextStep();
  };

  const handleBack = (e) => {
    e.preventDefault();
    prevStep();
  };

  return (
    <div className="register">
      <div className="form-container">
        <h1 className="mb-5">User Term</h1>
        {renderSelect("roleId", "Role", roles, true)}

        <p className="text-warning">
          First Time login will have a lecture role
        </p>

        <Table>
          <tbody>
            <tr>
              <td style={{ width: "10%" }}>
                <Form.Check className="mb-2 pl-0">
                  <Form.Check.Label>
                    <Form.Check.Input
                      defaultValue=""
                      checked={isCheck}
                      type="checkbox"
                      onChange={handleCheck}
                    ></Form.Check.Input>
                    <span className="form-check-sign"></span>
                  </Form.Check.Label>
                </Form.Check>
              </td>
              <td>I Agree with this policy</td>
            </tr>
          </tbody>
        </Table>

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
              disabled={!isCheck}
              variant="primary"
              onClick={(e) => handleContinue(e)}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTerm;
