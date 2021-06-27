import React from "react";
import Joi from "joi";
import _ from "lodash";

import FormCommon from "../components/common/form";
import LoadingPage from "../components/loadingPage";
import { getSemester, saveSemester } from "../services/semesterService";
import { toast } from "react-toastify";

// react-bootstrap components
import { Form, Row, Col } from "react-bootstrap";

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
    const { selectedSemester } = this.props;
    if (_.isEmpty(selectedSemester)) return;
    this.setState({ data: this.mapToViewModel(selectedSemester) });
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
      const { onUpdateSemesters } = this.props;
      const { data } = await saveSemester(this.state.data);
      onUpdateSemesters(data);
    } catch (err) {}
  };

  render() {
    return (
      <>
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col className="pr-1" md="2">
              {this.renderInput("name", "Display Name", "Name")}
            </Col>
            <Col className="px-1" md="5">
              {this.renderInput("year", "Year of Semester", "Year")}
            </Col>
            <Col className="pl-1" md="5">
              {this.renderInput("symbol", "Symbol of Semester", "Symbol")}
            </Col>
          </Row>
          {this.renderSubmit("Save")}
        </Form>
      </>
    );
  }
}

export default SemesterForm;
