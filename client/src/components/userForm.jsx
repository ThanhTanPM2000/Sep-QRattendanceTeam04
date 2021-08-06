import React from "react";
import Joi from "joi";
import _ from "lodash";

import FormCommon from "./common/form";
import FacultyService from "../services/facultyService";
import RoleService from "../services/roleService";
import UserService from "../services/userService";

// react-bootstrap components
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";

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
    isHandling: false,
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
    const { data: faculties } = await FacultyService.getFaculties();
    const myData = { ...this.state.data };
    myData["facultyId"] = faculties[0]._id;
    this.setState({ faculties, data: myData });
  }

  async populateRoles() {
    const { data: roles } = await RoleService.getRoles();
    const myData = { ...this.state.data };
    myData["roleId"] = roles[0]._id;
    this.setState({ roles, data: myData });
  }

  async populateUsers() {
    const { selectedUser } = this.props;
    if (_.isEmpty(selectedUser)) return;
    this.setState({ data: this.mapToViewModel(selectedUser) });
  }

  async populate() {
    await this.populateFaculties();
    await this.populateRoles();
    this.populateUsers();
  }

  componentDidMount() {
    this.populate();
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
      const { data } = await UserService.saveUser(this.state.data);
      toast.success("Successfully");
      onUpdateUsers(data);
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  doChange = (input, data) => {
    return data;
  };

  render() {
    const { faculties, roles } = this.state;
    const { selectedUser } = this.props;
    return (
      <>
        <Form onSubmit={this.handleSubmit}>
          {this.renderInput("userId", "User Id", "Id")}
          {this.renderInput("name", "Display Name", "Name")}
          {this.renderInput(
            "mail",
            "Email Address",
            "Mail",
            selectedUser._id && true
          )}
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
