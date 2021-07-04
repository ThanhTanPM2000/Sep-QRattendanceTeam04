import React from "react";
import Joi from "joi";
import _ from "lodash";
import { toast } from "react-toastify";
import { Form, Row, Col } from "react-bootstrap";

import FormCommon from "./common/form";
import SemesterService from "../services/semesterService";

class SemesterForm extends FormCommon {
  state = {
    data: {
      startYear: new Date().getFullYear(),
      endYear: new Date().getFullYear() + 1,
      name: "Hoc ky 1",
      symbol: "HK221",
    },
    listName: [
      { _id: "hoc ky 1", name: "Hoc ky 1" },
      { _id: "hoc ky 2", name: "Hoc ky 2" },
      { _id: "hoc ky 3", name: "Hoc ky 3" },
    ],
    errors: {},
  };

  schema = Joi.object({
    _id: Joi.string(),
    startYear: Joi.number()
      .required()
      .label("Start Year")
      .min(new Date().getFullYear())
      .max(3000),
    endYear: Joi.number().required().label("End Year"),
    name: Joi.string().required().label("Display Name"),
    symbol: Joi.string().required().label("Symbol"),
  });

  async populateSemesters() {
    const { selectedSemester } = this.props;
    if (_.isEmpty(selectedSemester)) return;
    this.setState({ data: this.mapToViewModel(selectedSemester) });
  }

  async componentDidMount() {
    await this.populateSemesters();
  }

  mapToViewModel = (semester) => {
    return {
      _id: semester._id,
      startYear: _.split(semester.year, "-", 2)[0],
      endYear: _.split(semester.year, "-", 2)[1],
      name: semester.name,
      symbol: semester.symbol,
    };
  };

  doSubmit = async () => {
    try {
      const { onUpdateSemesters } = this.props;
      const { data } = await SemesterService.saveSemester(this.state.data);
      toast.success("Successfully");
      onUpdateSemesters(data);
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  doChange = (input, data) => {
    //only for semester
    if (input.name === "startYear") {
      data["endYear"] = parseInt(input.value) + 1;
      data["symbol"] = `HK${data["endYear"].toString().slice(2)}${data[
        "name"
      ].slice(7)}`;
    }
    if (input.value.startsWith("hoc ky")) {
      data["symbol"] = `HK${data["endYear"].toString().slice(2)}${data[
        "name"
      ].slice(7)}`;
    }

    return data;
  };

  render() {
    const { listName } = this.state;

    return (
      <>
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col md="6">
              {this.renderInput("startYear", "From Year", "Year")}
            </Col>
            <Col>{this.renderInput("endYear", "End Year", "Year", true)}</Col>
          </Row>
          {this.renderSelect("name", "Display Name", listName)}
          {this.renderInput(
            "symbol",
            "Symbol of Semester",
            "Semester Symbol",
            true
          )}
          {this.renderSubmit("Save")}
        </Form>
      </>
    );
  }
}

export default SemesterForm;
