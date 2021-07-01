import React from "react";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";
import { Table } from "react-bootstrap";

import LoadingPage from "./loadingPage";

const TableCommon = ({ columns, sortColumn, onSort, data }) => {
  return (
    <LoadingPage data={data}>
      <Table className="table-hover table-striped">
        <TableHeader
          columns={columns}
          sortColumn={sortColumn}
          onSort={onSort}
        />
        <TableBody columns={columns} data={data} />
      </Table>
    </LoadingPage>
  );
};

export default TableCommon;
