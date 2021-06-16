import React from "react";
import Joi from "joi";

import Form from "./common/form";
import { getUser } from "../services/fakeUsersService";

class UserForm extends Form {
  state = {
    data: {
      displayName: "",
      mail: "",
    },
    errors: {},
  };

  schema = Joi.object({
    _id: Joi.string(),
    displayName: Joi.string().required(),
    mail: Joi.string().required(),
  });

  componentDidMount() {
    const userId = this.props.match.params.id;
    if (userId === "new") return;

    const user = getUser(userId);
    if (!user) return this.props.history.replace("/not-found");

    this.setState({ data: this.mapToViewModel(user) });
  }

  mapToViewModel = (user) => {
    console.log(user);
    return {
      displayName: user.displayName,
      mail: user.mail,
    };
  };

  doSubmit = () => {
    console.log("submitted");
    this.props.history.push("/users");
  };

  render() {
    return (
      <div>
        <h1> User Form</h1>
        <form>
          {this.renderInput("displayName", "Display Name")}
          {this.renderInput("mail", "Mail")}
          {this.renderSubmit("Save")}
        </form>
      </div>
    );
  }
}

export default UserForm;
