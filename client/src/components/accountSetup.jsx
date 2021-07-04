import React from "react";

const AccountSetup = ({
  renderInput,
  renderSelect,
  renderSubmit,
  faculties,
  roles,
  onValidation,
  nextStep,
}) => {
  return (
    <div className="register">
      <div className="form-container">
        <form onSubmit={(e) => nextStep(e)}>
          <h1 className="mb-5">Account Setup</h1>
          {renderInput("name", "Display Name", "Name", true)}
          {renderInput("userId", "User Id", "UserId")}
          {renderInput("mail", "Email Address", "Email", true)}
          {renderInput("degree", "Degree", "degree")}
          {renderSelect("facultyId", "Faculty", faculties, "name")}
          <div className="text-right">{renderSubmit("Continue")}</div>
        </form>
      </div>
    </div>
  );
};

export default AccountSetup;
