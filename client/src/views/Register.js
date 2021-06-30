import React from "react";
import form from "../components/common/form";
import Joi from "joi";
import { getFaculties } from "services/facultyService";
import { getRoles } from "services/roleService";
import { Modal, Button } from "react-bootstrap";

import auth from "../services/authService";
import AccountSetup from "../components/accountSetup";

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

  nextStep = () => {
    const { step } = this.state;
    this.setState({ step: step + 1 });
  };

  prevStep = () => {
    const { step } = this.step;
    this.setState({ step: step - 1 });
  };

  doSubmit = async () => {};

  async populateFaculties() {
    const { data: faculties } = await getFaculties();
    this.setState({ faculties });
  }

  async populateRoles() {
    const { data: roles } = await getRoles();
    this.setState({ roles });
  }

  async populateUsers() {
    const user = auth.getCurrentUser();
    this.setState({ data: this.mapToViewModel(user) });
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

  mapToViewModel = (user) => {
    return {
      userId: user.userId,
      name: user.name,
      mail: user.mail,
      degree: user.degree,
      roleId: user.role._id,
    };
  };

  renderStep = () => {
    const { step, data } = this.state;
    switch (step) {
      case 1:
        return (
          <AccountSetup
            renderInput={this.renderInput}
            data={data}
            nextStep={this.nextStep}
          />
        );

      default:
        break;
    }
  };

  render() {
    return <div className="form-container">{this.renderStep()}</div>;
  }
}

export default Register;
