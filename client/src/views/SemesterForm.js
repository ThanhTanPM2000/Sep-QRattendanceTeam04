import React from "react";
import Joi from "joi";

import FormCommon from "../components/common/form";
import LoadingPage from "../components/loadingPage";
import { getSemester, saveSemester } from "../services/semesterService";
import { toast } from "react-toastify";

// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Form,
  Navbar,
  Nav,
  Container,
  Row,
  Col,
} from "react-bootstrap";

class SemesterForm extends FormCommon {
  state = {
    data: {
      name: "",
      year: "",
      symbol: "",
    },
    errors: {},
  };

  schema = Joi.object({
    _id: Joi.string(),
    name: Joi.string().required().label("Display Name"),
    year: Joi.string().required().label("Year"),
    symbol: Joi.string().required().label("Symbol"),
  });

  async populateSemesters() {
    try {
      const id = this.props.match.params.id;
      if (id === "new") return;

      const { data: semester } = await getSemester(id);
      this.setState({ data: this.mapToViewModel(semester), disable: true });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        this.props.history.replace("/not-found");
      }
    }
  }

  async componentDidMount() {
    await this.populateSemesters();
  }

  mapToViewModel = (semester) => {
    return {
      _id: semester._id,
      name: semester.name,
      year: semester.year,
      symbol: semester.symbol,
    };
  };

  doSubmit = async () => {
    try {
      await saveSemester(this.state.data);
      this.props.history.push("/semesters");
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return (
      <>
        <Container fluid>
          <Row>
            <Col md="12">
              <Card>
                <Card.Header>
                  <Card.Title as="h4">Edit Semester</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={this.handleSubmit}>
                    <Row>
                      <Col className="px-1" md="2">
                        {this.renderInput("name", "Display Name", "Name")}
                      </Col>
                      <Col className="pr-1" md="5">
                        {this.renderInput("year", "Year of Semester", "Year")}
                      </Col>
                      <Col className="pl-1" md="5">
                        {this.renderInput("symbol", "Semester's symbol", "Symbol")}
                      </Col>
                    </Row>
                    {this.renderSubmit("Save")}
                    <div className="clearfix"></div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default SemesterForm;
