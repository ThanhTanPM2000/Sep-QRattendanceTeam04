import React from "react";
import Joi from "joi";
import _ from "lodash";

import FormCommon from "../components/common/form";
import LoadingPage from "../components/common/loadingPage";
import { getFaculties } from "../services/facultyService";
import { getRoles } from "../services/roleService";
import { getUser, saveUser } from "../services/userService";
import { toast } from "react-toastify";

// react-bootstrap components
import { Form, Row, Col } from "react-bootstrap";

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
          <Row>
            <Col className="pr-1" md="2">
              {this.renderInput("userId", "User Id", "Id")}
            </Col>
            <Col className="px-1" md="5">
              {this.renderInput("name", "Display Name", "Name")}
            </Col>
            <Col className="pl-1" md="5">
              {this.renderInput("mail", "Email Address", "Mail")}
            </Col>
          </Row>
          <Row>
            <Col className="pr-1" md="6">
              {this.renderInput("degree", "Degree", "Degree")}
            </Col>
            {/* <Col className="pl-1" md="6">
                        <Form.Group>
                          <label>Last Name</label>
                          <Form.Control
                            defaultValue="Andrew"
                            placeholder="Last Name"
                            type="text"
                          ></Form.Control>
                        </Form.Group>
                      </Col> */}
          </Row>
          <Row>
            <Col md="12">
              {this.renderSelect("facultyId", "Faculties", faculties)}
              {/* <Form.Group>
                          <label>Address</label>
                          <Form.Control
                            defaultValue="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
                            placeholder="Home Address"
                            type="text"
                          ></Form.Control>
                        </Form.Group> */}
            </Col>
          </Row>
          <Row>
            <Col md="12">
              {this.renderSelect("roleId", "Roles", roles)}
              {/* <Form.Group>
                          <label>City</label>
                          <Form.Control
                            defaultValue="Mike"
                            placeholder="City"
                            type="text"
                          ></Form.Control>
                        </Form.Group> */}
            </Col>
            {/* <Col className="px-1" md="4">
                        <Form.Group>
                          <label>Country</label>
                          <Form.Control
                            defaultValue="Andrew"
                            placeholder="Country"
                            type="text"
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                      <Col className="pl-1" md="4">
                        <Form.Group>
                          <label>Postal Code</label>
                          <Form.Control
                            placeholder="ZIP Code"
                            type="number"
                          ></Form.Control>
                        </Form.Group>
                      </Col> */}
          </Row>
          {/* <Row>
                      <Col md="12">
                        <Form.Group>
                          <label>About Me</label>
                          <Form.Control
                            cols="80"
                            defaultValue="Lamborghini Mercy, Your chick she so thirsty, I'm in
                          that two seat Lambo."
                            placeholder="Here can be your description"
                            rows="4"
                            as="textarea"
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                    </Row> */}
          {this.renderSubmit("Save")}
        </Form>
      </>
    );
  }
}

export default UserForm;
