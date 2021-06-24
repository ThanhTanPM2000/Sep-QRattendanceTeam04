import React from "react";
import Joi from "joi";

import Form from "./common/form";
import { saveUser } from "../services/userService";
import { getFaculties } from "../services/facultyService";
import { getRoles } from "../services/roleService";
import auth from "../services/authService";

class RegisterForm extends Form {
  state = {
    data: {
      userId: "",
      name: "",
      mail: "",
      degree: "",
      facultyId: "",
      roleId: "",
    },
    faculties: [],
    roles: [],
    errors: {},
  };

  schema = Joi.object({
    userId: Joi.string().min(5).max(10).required().label("User Id"),
    name: Joi.string().required().label("Display Name"),
    mail: Joi.string().required().label("Mail"),
    degree: Joi.string().required().label("Degree"),
    facultyId: Joi.string().required().label("Faculty"),
    roleId: Joi.string().required().label("Role"),
  });

  async populateFaculties() {
    const { data: faculties } = await getFaculties();
    this.setState({ faculties });
  }

  async populateRoles() {
    const { data: roles } = await getRoles();
    this.setState({ roles });
  }

  async componentDidMount() {
    await this.populateFaculties();
    await this.populateRoles();

    const { user } = this.props.location.state;
    const data = { ...this.state.data };
    data.name = user.name;
    data.mail = user.mail;
    this.setState({ data });
  }

  doSubmit = async () => {
    try {
      const response = await saveUser(this.state.data);
      auth.loginWithJwt(response.headers["x-auth-token"]);
      this.props.history.push("/");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = error.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    const { faculties, roles } = this.state;
    return (
      <div>
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("userId", "User Id")}
          {this.renderInput("name", "Display Name")}
          {this.renderInput("mail", "Mail", true)}
          {this.renderInput("degree", "Degree")}
          {this.renderSelect("facultyId", "Faculties", faculties)}
          {this.renderSelect("roleId", "Roles", roles)}
          {this.renderSubmit("Save")}
        </form>
      </div>
    );
  }
}

export default RegisterForm;
