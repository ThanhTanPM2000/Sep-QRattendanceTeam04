import React from "react";
import Joi from "joi";
import _ from "lodash";

import FormCommon from "../components/common/form";
import { getFaculties } from "../services/facultyService";
import { getRoles } from "../services/roleService";
import { saveUser } from "../services/userService";

// react-bootstrap components
import { Form } from "react-bootstrap";

class UserForm extends FormCommon {
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

  async populateFaculties() {
    const { data: faculties } = await getFaculties();
    this.setState({ faculties });
  }

  async populateRoles() {
    const { data: roles } = await getRoles();
    this.setState({ roles });
  }

  async populateUsers() {
    const { selectedUser } = this.props;
    if (_.isEmpty(selectedUser)) return;
    this.setState({ data: this.mapToViewModel(selectedUser) });
  }

  async componentDidMount() {
    await this.populateFaculties();
    await this.populateRoles();
    await this.populateUsers();
  }

  mapToViewModel = (user) => {
    return {
      _id: user._id,
      userId: user.userId,
      name: user.name,
      mail: user.mail,
      degree: user.degree,
      facultyId: user.faculty._id,
      roleId: user.role._id,
    };
  };

  doSubmit = async () => {
    try {
      const { onUpdateUsers } = this.props;
      const { data } = await saveUser(this.state.data);
      onUpdateUsers(data);
    } catch (err) {}
  };

  render() {
    const { faculties, roles } = this.state;
    return (
      <>
        <Form onSubmit={this.handleSubmit}>
          {this.renderInput("userId", "User Id", "Id")}
          {this.renderInput("name", "Display Name", "Name")}
          {this.renderInput("mail", "Email Address", "Mail")}
          {this.renderInput("degree", "Degree", "Degree")}
          {this.renderSelect("facultyId", "Faculties", faculties)}
          {this.renderSelect("roleId", "Roles", roles)}
          {this.renderSubmit("Save")}
        </Form>
      </>
    );
  }
}

export default UserForm;
