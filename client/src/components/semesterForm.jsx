import React from "react";
import Joi from "joi";

import Form from "./common/form";
import LoadingPage from "./loadingPage";
import { getSemester, saveSemester} from "../services/semesterService";
import { toast } from "react-toastify";

class SemesterForm extends Form {
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
      <LoadingPage>
        <div className="auth-wrapper auth-inner">
          {this.state.data.name ? (
            <h1>Update Semester</h1>
          ) : (
            <h1>Create new Semester</h1>
          )}
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("name", "Display Name")}
            {this.renderInput("year", "Year")}
            {this.renderInput("symbol", "Symbol")}
            {this.renderSubmit("Save")}
          </form>
        </div>
      </LoadingPage>
    );
  }
}

export default SemesterForm;
