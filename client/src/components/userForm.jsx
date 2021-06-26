import React from "react";
import Joi from "joi";

import Form from "./common/form";
import { getFaculties } from "../services/facultyService";
import { getRoles } from "../services/roleService";
import { getUser, saveUser } from "../services/userService";
import { toast } from "react-toastify";

class UserForm extends Form {
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
    mail: Joi.string().required().email({ tlds: {allow: false} }).label("Mail"),
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
    try {
      const id = this.props.match.params.id;
      if (id === "new") return;

      const { data: user } = await getUser(id);
      this.setState({ data: this.mapToViewModel(user), disable: true });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        this.props.history.replace("/not-found");
      }
    }
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
      await saveUser(this.state.data);
      this.props.history.push("/users");
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { faculties, roles } = this.state;
    return (
      <div className="auth-wrapper auth-inner">
        {this.state.data.name ? <h1>Update User</h1> : <h1>Create new User</h1>}
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

export default UserForm;
