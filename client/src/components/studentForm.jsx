import React from "react";
import Joi from "joi";
import _ from "lodash";

import FormCommon from "./common/form";

// react-bootstrap components
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";
import ClassService from "../services/classService";

class StudentForm extends FormCommon {
  state = {
    data: {
      studentId: "Student not login yet",
      name: "Student not login yet",
      mail: "",
    },
    errors: {},
  };

  schema = Joi.object({
    name: Joi.string().label("Display Name"),
    studentId: Joi.string().min(5).label("Student Id"),
    mail: Joi.string()
      .required()
      .email({ tlds: { allow: false } })
      .label("Mail"),
  });

  componentDidMount() {
    const { selectedStudent } = this.props;
    if (_.isEmpty(selectedStudent)) return;
    this.setState({ data: this.mapToViewModel(selectedStudent) });
  }

  mapToViewModel = (student) => {
    return {
      studentId: student.studentId,
      name: student.name,
      mail: student.mail,
    };
  };

  doSubmit = async () => {
    try {
      const { onUpdateStudent, myClass } = this.props;
      const { data } = await ClassService.saveStudentInClass(
        myClass,
        this.state.data
      );
      onUpdateStudent(data);
      toast.success("Successfully");
    } catch (err) {
      // console.log(err);
      toast.error(err.response.data);
    }
  };

  doChange = (input, data) => {
    return data;
  };

  render() {
    const { data } = this.state;
    const { selectedStudent } = this.props;
    return (
      <>
        <Form onSubmit={this.handleSubmit}>
          {data.name !== "Student not login yet" && (
            <>
              {this.renderInput("studentId", "Student Id", "Id of Student")}
              {this.renderInput("name", "Display Name", "Name")}
            </>
          )}
          {this.renderInput(
            "mail",
            "Email Address",
            "Mail",
            selectedStudent.studentId && true
          )}
          {this.renderSubmit("Save")}
        </Form>
      </>
    );
  }
}

export default StudentForm;
