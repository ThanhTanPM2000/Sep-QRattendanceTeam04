import React from "react";
import form from "../components/common/form";
import { Modal, Button } from "react-bootstrap";

import { auth } from "../services/authService";

class Register extends form {
  state = {
    data: {
      userId: "",
      name: auth.getCurrentUser().name,
      mail: auth.getCurrentUser().mail,
      degree: "",
      facultyId: "",
      roleId: "60cfdfd15be490cbb63461bf",
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
    const user = {};
    this.setState({ data: this.mapToViewModel(selectedUser) });
    // try {
    //   const id = this.props.match.params.id;
    //   if (id === "new") return;

    //   const { data: user } = await getUser(id);
    // } catch (error) {
    //   if (error.response && error.response.status === 404) {
    //     this.props.history.replace("/not-found");
    //   }
    // }
  }

  async componentDidMount() {
    await this.populateFaculties();
    await this.populateRoles();
    await this.populateUsers();
  }

  render() {
    return (
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>Add more information about you</Modal.Title>
        </Modal.Header>
        <Modal.Body>{this.renderInput("")}</Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal.Dialog>
    );
  }
}

export default Register;
