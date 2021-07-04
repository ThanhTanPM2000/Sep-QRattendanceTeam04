import React from "react";
import readXlsxFile from "read-excel-file";
import { InputGroup, Modal, Form, Table, Button } from "react-bootstrap";
import TableScrollbar from "react-table-scrollbar";
import _ from "lodash";
import moment from "moment";

import LoadingComponent from "react-spinners/ClipLoader";
import ClassService from "../../services/classService";
import "../../assets/css/modalImport.css";
import { toast } from "react-toastify";

const ModalImport = ({ titleHeader, onHandleImport, ...otherProps }) => {
  const [label, setLabel] = React.useState("Choose File");
  const [errors, setErrors] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [rowsShow, setRowsShow] = React.useState([]);

  const [isHandling, setIsHandling] = React.useState(false);
  const [isFinish, setIsFinish] = React.useState(false);

  const convertDate = (value) => {
    try {
      let dateParts;
      let dateObject;
      let result = value;
      if (typeof value === "string") {
        dateParts = value.split("/");
        dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
        result = new Date(dateObject);
      }

      if (isNaN(result.getTime())) {
        throw new Error("invalid");
      }
      return result;
    } catch (error) {
      throw new Error("invalid");
    }
  };

  const schema = {
    Status: {
      prop: "status",
      type: String,
    },
    "Mã Lớp HP": {
      prop: "classTermId",
      type: String,
    },
    "Tên học phần": {
      prop: "name",
      type: String,
    },
    "Số tín chỉ": {
      prop: "numOfCredits",
      type: String,
    },
    "Loại HP": {
      prop: "courseType",
      type: String,
    },
    Khóa: {
      prop: "schoolYear",
      type: String,
    },
    "Ngày bắt đầu": {
      prop: "startDate",
      type: convertDate,
    },
    "Ngày kết thúc": {
      prop: "endDate",
      type: convertDate,
    },
    "Phòng học": {
      prop: "room",
      type: String,
    },
    Thứ: {
      prop: "dayOfWeek",
      type: Number,
    },
    "Số tuần học": {
      prop: "numOfWeek",
      type: Number,
    },
    Tiết: {
      prop: "session",
      type: String,
    },
    "Mã học kỳ": {
      prop: "semesterId",
      type: String,
    },
    "Email GV": {
      prop: "lecturerMail",
      type: String,
    },
  };

  const raiseImport = (e) => {
    readXlsxFile(e.target.files[0], {
      schema,
      sheet: 1,
      dateFormat: "mm/dd/yyyy",
    })
      .then(({ rows, errors }) => {
        setErrors(errors);
        const data = rows.filter((x) => Object.keys(x).length === 13);
        setRows(data);
        setRowsShow(data);
        setLabel(e.target.files[0].name);
      })
      .catch((err) => {
        console.log("err ", err);
      });
  };

  const handleImport = async () => {
    setIsHandling(true);

    let newRows = [...rowsShow];
    let importedClasses = [];

    for (var i = 0; i <= rows.length; i++) {
      try {
        const { data } = await ClassService.saveClass(rows[i]);
        importedClasses.push(data);
        newRows[i] = { status: "Success", ...rows[i] };
      } catch (error) {
        console.log(error);
        newRows[i] = { status: "Failed", ...rows[i] };
      }
      setRowsShow(newRows);
    }

    if (importedClasses.length !== 0) {
      onHandleImport(importedClasses);
    }

    setIsHandling(false);
    setIsFinish(true);
  };

  const renderCall = (item, column) => {
    if (column.prop === "startDate" || column.prop === "endDate") {
      return moment(_.get(item, column.prop)).format("DD/MM/YYYY");
    }
    return _.get(item, column.prop);
  };

  const createKey = (item, column) => {
    return item.classTermId + column.prop;
  };

  const handleExit = () => {
    setIsHandling(false);
    setErrors([]);
    setIsFinish(false);
    setRows([]);
    setRowsShow([]);
    setLabel("Choose File");
  };

  return (
    <React.Fragment>
      <Modal
        size="xl"
        backdrop="static"
        centered
        aria-labelledby="gogo"
        onExit={handleExit}
        {...otherProps}
      >
        <Modal.Header closeButton>
          <Modal.Title id="gogo">{titleHeader}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id="hello">
                <span>Upload</span>
              </InputGroup.Text>
            </InputGroup.Prepend>
            <div className="custom-file">
              <Form.Control
                type="file"
                disabled={isHandling}
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                id="inputGroupFile01"
                onChange={raiseImport}
                className="custom-file-input"
                aria-describedby="hello"
              />
              <label className="custom-file-label" htmlFor="inputGroupFile01">
                {label}
              </label>
            </div>
            <div></div>
          </InputGroup>

          {rows.length !== 0 ? (
            <div className="showPreviewTable mt-3">
              <p>Showing {rows.length}</p>

              <TableScrollbar rows={5}>
                <Table striped bordered hover>
                  <thead className="thead-dark">
                    <tr>
                      {Object.keys(schema).map((x) => (
                        <th key={x.replace(" ", "-")}>{x}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rowsShow.map((item) => (
                      <tr key={`${item.classTermId}${item.schoolYear}`}>
                        {Object.values(schema).map((column) => (
                          <td key={createKey(item, column)}>
                            {renderCall(item, column)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableScrollbar>

              {isHandling ? (
                <>
                  <Button
                    className="btn-fill loadingButton btn-wd mt-3"
                    variant="primary"
                  >
                    <LoadingComponent
                      color="#D0021B"
                      loading={isHandling}
                      size={18}
                    />
                    <div className="loader-message">Please waiting ...</div>
                  </Button>
                </>
              ) : (
                <>
                  {isFinish ? (
                    <Button
                      className="btn-fill btn-wd mt-3"
                      onClick={handleExit}
                      variant="success"
                    >
                      Finish
                    </Button>
                  ) : (
                    <Button
                      className="btn-fill btn-wd mt-3"
                      onClick={handleImport}
                      variant="primary"
                    >
                      Import
                    </Button>
                  )}
                </>
              )}
            </div>
          ) : (
            <p className="mt-3">Please import valid xlsx</p>
          )}
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default ModalImport;
