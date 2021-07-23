import React from "react";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";
import { Table } from "react-bootstrap";

const TableCommon = ({ columns, sortColumn, onSort, data }) => {
  return (
    <Table className="table-hover table-striped">
      {/* // <Table striped bordered hover size="sm"> */}
      <TableHeader columns={columns} sortColumn={sortColumn} onSort={onSort} />
      <TableBody columns={columns} data={data} />
    </Table>
  );
};

export default TableCommon;
