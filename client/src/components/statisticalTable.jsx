import React from "react";

import { Link } from "react-router-dom";
import TableCommon from "./common/table";
import { Table } from "react-bootstrap";

const StatisticalTable = ({ lessons }) => {
  return (
    <React.Fragment>
      <div style={{ height: "350px", overflow: "auto" }}>
        <Table className="table-hover table-striped">
          <thead className="thead-dark">
            <tr>
              <th key="Student-Mail">Student Mail</th>
              <th key="Student-Name">Student Name</th>
              {lessons.map((x) => (
                <th key={x.name}>{x.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lessons[0].students.map((x, index) => (
              <tr key={`${x.name}${index}`}>
                <td key={x.mail}>{x.mail}</td>
                <td key={`${x.name}${index}`}>{x.name}</td>
                {lessons.map((y) => (
                  <>
                    <td key={`${x.name}${y.name}`}>
                      {y.students[index].status !== "Not Attended" ? (
                        <i
                          style={{ color: "green", fontWeight: "bold" }}
                          className="nc-icon nc-check-2"
                        ></i>
                      ) : (
                        <i
                          style={{ color: "red", fontWeight: "bold" }}
                          className="nc-icon nc-simple-remove"
                        ></i>
                      )}
                    </td>
                  </>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="mt-3">
        <i
          style={{ color: "green", fontWeight: "bold" }}
          className="nc-icon nc-check-2"
        />
        <span> Attended </span>

        <i
          style={{ color: "red", fontWeight: "bold" }}
          className="nc-icon nc-simple-remove"
        />
        <span> Not Attended</span>
      </div>

      <div></div>
    </React.Fragment>
  );
};

export default StatisticalTable;
