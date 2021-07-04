import React from "react";
import _ from "lodash";

import FormCommon from "./common/form";
import SemesterService from "../services/semesterService";
import UserService from "../services/userService";
import ClassService from "../services/classService";

// react-bootstrap components
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";

const Joi = require("joi").extend(require("@joi/date"));

class ClassForm extends FormCommon {
  state = {
    data: {
      classTermId: "",
      name: "",
      numOfCredits: "",
      courseType: "",
      schoolYear: "",
      startDate: null,
      endDate: null,
      room: "",
      dayOfWeek: "",
      numOfWeek: "",
      semesterId: "",
      lecturerId: "",
    },
    semesters: [],
    lecturers: [],
    errors: {},
  };

  schema = Joi.object({
    _id: Joi.string(),
    classTermId: Joi.string().required(),
    name: Joi.string().min(5).max(50).required().label("Class Name"),
    numOfCredits: Joi.number().required().label("Number Of Credits"),
    courseType: Joi.string().min(2).max(2).required().label("Course Type"),
    schoolYear: Joi.string().required().label("School Year"),
    startDate: Joi.date().required().label("Start Date"),
    endDate: Joi.date().required().label("End Date"),
    room: Joi.string().required().label("Room"),
    dayOfWeek: Joi.string().required().label("Day Of Week"),
    numOfWeek: Joi.number().required().label("Number Of Week"),
    semesterId: Joi.string().required().label("Semester"),
    lecturerId: Joi.string().required().label("Lecturer"),
  });

  async populateSemesters() {
    const { data: semesters } = await SemesterService.getSemesters();
    const myData = { ...this.state.data };
    myData["semesterId"] = semesters[0]._id;
    this.setState({ semesters, data: myData });
  }

  async populateLecturer() {
    const { data: lecturers } = await UserService.getUsers();
    const myData = { ...this.state.data };
    myData["lecturerId"] = lecturers[0]._id;
    this.setState({ lecturers, data: myData });
  }

  async populateClasses() {
    const { selectedClass } = this.props;
    if (_.isEmpty(selectedClass)) return;
    this.setState({ data: this.mapToViewModel(selectedClass) });
  }

  componentDidMount() {
    this.populateSemesters();
    this.populateLecturer();
    this.populateClasses();
  }

  mapToViewModel = (selectedClass) => {
    return {
      _id: selectedClass._id,
      classTermId: selectedClass.classTermId,
      name: selectedClass.name,
      numOfCredits: selectedClass.numOfCredits,
      courseType: selectedClass.courseType,
      schoolYear: selectedClass.schoolYear,
      startDate: new Date(selectedClass.startDate),
      endDate: new Date(selectedClass.endDate),
      room: selectedClass.room,
      dayOfWeek: selectedClass.dayOfWeek,
      numOfWeek: selectedClass.numOfWeek,
      semesterId: selectedClass.semester._id,
      lecturerId: selectedClass.lecturer._id,
    };
  };

  doSubmit = async () => {
    try {
      const { onUpdateClass } = this.props;
      console.log("sumit data ", this.state.data);
      const { data } = await ClassService.saveClass(this.state.data);
      console.log(data);
      toast.success("Successfully");
      onUpdateClass(data);
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  doChange = (input, data) => {
    return data;
  };

  render() {
    const { semesters, lecturers } = this.state;
    const { show, onHide } = this.props;

    console.log("data is ", this.state.data.startDate);

    return (
      <>
        <Form onSubmit={this.handleSubmit}>
          {this.renderInput("classTermId", "Class Id", "Class Term ID")}
          {this.renderInput("name", "Class Name", "Name of Class")}
          {this.renderInput(
            "numOfCredits",
            "Number Of Credits",
            "Number Of Credits in Class"
          )}
          {this.renderInput("courseType", "Course Type", "Course Type")}
          {this.renderInput("schoolYear", "School Year", "School Year")}
          {this.renderDatePicker(
            "startDate",
            "endDate",
            "Start Date - End Date"
          )}
          {this.renderInput("room", "Room", "Room of Class")}
          {this.renderInput("dayOfWeek", "Day of Week", "etc: Monday, Friday")}
          {this.renderInput(
            "numOfWeek",
            "Number of Week",
            "How many week through this Class"
          )}
          {this.renderSelect("semesterId", "Semester", semesters, "symbol")}
          {this.renderSelect("lecturerId", "Lecturer", lecturers, "mail")}
          {this.renderSubmit("Save")}
        </Form>
      </>
    );
  }
}

export default ClassForm;
