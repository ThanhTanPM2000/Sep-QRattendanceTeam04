import React from "react";
import readXlsxFile from "read-excel-file";
import { InputGroup, Modal, Form, Table, Button } from "react-bootstrap";
import TableScrollbar from "react-table-scrollbar";
import _ from "lodash";
import moment from "moment";

import writeXlsxFile from "write-excel-file";

import LoadingComponent from "react-spinners/ClipLoader";
import ClassService from "../services/classService";
import "assets/css/modalImport.css";
import { toast } from "react-toastify";

const ModalImportClass = ({ titleHeader, onHandleImport, ...otherProps }) => {
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

  const data = [
    // Row #1
    [
      // Column #1
      {
        value: "Mã Lớp HP",
        fontWeight: "bold",
      },
      // Column #3
      {
        value: "Tên học phần",
        fontWeight: "bold",
      },
      // Column #4
      {
        value: "Số tín chỉ",
        fontWeight: "bold",
      },
      // Column #4
      {
        value: "Loại HP",
        fontWeight: "bold",
      },
      {
        value: "Khóa",
        fontWeight: "bold",
      },
      {
        value: "Ngày bắt đầu",
        fontWeight: "bold",
      },
      {
        value: "Ngày kết thúc",
        fontWeight: "bold",
      },
      {
        value: "Phòng học",
        fontWeight: "bold",
      },
      {
        value: "Thứ",
        fontWeight: "bold",
      },
      {
        value: "Số tuần học",
        fontWeight: "bold",
      },
      {
        value: "Tiết",
        fontWeight: "bold",
      },
      {
        value: "Mã học kỳ",
        fontWeight: "bold",
      },
      {
        value: "Email GV",
        fontWeight: "bold",
      },
    ],
    [
      // Column #1
      {
        type: String,
        value: "202_DIT0030_01",
      },

      {
        type: String,
        value: "Kỹ năng nghề nghiệp CNTT",
      },

      {
        type: String,
        value: "2",
      },

      {
        type: String,
        value: "LT",
      },

      {
        type: String,
        value: "K26T",
      },
      // Column #2
      {
        type: Date,
        value: new Date(),
        format: "mm/dd/yyyy",
      },
      {
        type: Date,
        value: new Date(),
        format: "mm/dd/yyyy",
      },
      {
        type: String,
        value: "CS3.A.09.01",
      },
      {
        type: Number,
        value: 2,
      },
      {
        type: Number,
        value: 11,
      },
      {
        type: String,
        value: "1-3",
      },
      {
        type: String,
        value: "HK221",
      },
      {
        type: String,
        value: "chau.lth@vlu.edu.vn",
      },
    ],
  ];

  const raiseImport = (e) => {
    readXlsxFile(e.target.files[0], {
      schema,
      sheet: 1,
      dateFormat: "mm/dd/yyyy",
    })
      .then(({ rows, errors }) => {
        setErrors(errors);
        const data = rows.filter((x) => Object.keys(x).length === 13);
        if (data.length === 0) {
          toast.warning("Please input valid file");
        }
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

    for (var i = 0; i <= rows.length - 1; i++) {
      try {
        const { data } = await ClassService.saveClass(rows[i]);
        importedClasses.push(data);
        newRows[i] = { status: "Success", ...rows[i] };
      } catch (error) {
        toast.error(error.response?.data);
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

  const handleDownloadTemplate = async () => {
    await writeXlsxFile(data, { fileName: "classImport.xlsx" });
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
                    <tr key="schemaHeader">
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
            <>
              <p className="mt-3">Please import valid xlsx</p>
              <a href="" onClick={handleDownloadTemplate}>
                Download template
              </a>
            </>
          )}
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default ModalImportClass;
