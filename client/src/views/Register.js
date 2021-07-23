import React from "react";
import form from "../components/common/form";
import Joi from "joi";
import FacultyService from "services/facultyService";
import RoleService from "services/roleService";
import _ from "lodash";

import auth from "../services/authService";
import AccountSetup from "../components/accountSetup";
import UserTerm from "../components/userTerm";

import "../assets/css/register.css";
import Confirm from "components/confirm";
import RegisteredAcc from "components/registeredAcc";
import UserService from "services/userService";
import { toast } from "react-toastify";
import { Redirect } from "react-router-dom";

class Register extends form {
  state = {
    step: 1,
    data: {
      userId: "",
      name: auth.getCurrentUser().name,
      mail: auth.getCurrentUser().mail,
      degree: "",
      facultyId: "",
      roleId: "60cfdfd15be490cbb63461bf",
    },
    isRegistered: false,
    faculties: [],
    user: "",
    roles: [],
    errors: {},
  };

  schema = Joi.object({
    _id: Joi.string(),
    userId: Joi.string().min(5).max(10).required().label("User Id"),
    name: Joi.string().required().label("Display Name"),
    mail: Joi.string()
      .required()
      .email({ tlds: { allow: false } })
      .label("Mail"),
    degree: Joi.string().required().label("Degree"),
    facultyId: Joi.string().required().label("Faculty"),
    roleId: Joi.string().required().label("Role"),
  });

  nextStep = () => {
    const { step } = this.state;
    this.setState({ step: step + 1 });
  };

  prevStep = () => {
    const { step } = this.state;
    this.setState({ step: step - 1 });
  };

  doSubmit = async () => {
    await this.nextStep();

    const { step } = this.state;

    if (step > 3) {
      this.doRegister();
    }
  };

  doRegister = async () => {
    try {
      const { data, headers } = await UserService.saveUser(this.state.data);
      if (data._id) this.setState({ isRegistered: true });
      auth.loginWithJwt(headers["x-auth-token"]);
    } catch (err) {
      toast.error(err.response.data);
      window.location = "/Not-Found";
    }
  };

  async populateFaculties() {
    const { data: faculties } = await FacultyService.getFaculties();
    const myData = { ...this.state.data };
    myData["facultyId"] = faculties[0]._id;
    this.setState({ faculties, data: myData });
  }

  async populateRoles() {
    const { data: roles } = await RoleService.getRoles();
    this.setState({ roles });
  }

  async populateUsers() {
    const { user } = this.props;
    this.setState({ user });
  }

  componentDidMount() {
    this.populateFaculties();
    this.populateRoles();
    // this.populateUsers()
  }

  doChange = (input, data) => {
    return data;
  };

  render() {
    const { step, data, faculties, isRegistered, roles } = this.state;
    switch (step) {
      case 1:
        return (
          <React.Fragment>
            {auth.getCurrentUser()?._id ? (
              <Redirect to="/" />
            ) : (
              <AccountSetup
                renderInput={(name, label, placeholder, isReadOnly = false) =>
                  this.renderInput(name, label, placeholder, isReadOnly)
                }
                renderSelect={(name, label, options, isReadOnly = false) =>
                  this.renderSelect(name, label, options, isReadOnly)
                }
                renderSubmit={(label) => this.renderSubmit(label)}
                user={data}
                faculties={faculties}
                roles={roles}
                onValidation={this.validation}
                nextStep={this.handleSubmit}
              />
            )}
          </React.Fragment>
        );
      case 2:
        return (
          <UserTerm
            renderSelect={(name, label, options, isReadOnly = false) =>
              this.renderSelect(name, label, options, isReadOnly)
            }
            nextStep={this.nextStep}
            roles={roles}
            prevStep={this.prevStep}
          />
        );
      case 3:
        return (
          <Confirm
            data={data}
            faculties={faculties}
            roles={roles}
            nextStep={this.handleSubmit}
            prevStep={this.prevStep}
          />
        );

      default:
        return <RegisteredAcc isRegistered={isRegistered} />;
    }
  }
}

export default Register;
