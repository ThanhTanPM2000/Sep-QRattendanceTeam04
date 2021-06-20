import React from "react";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";

const Table = ({ columns, sortColumn, onSort, data }) => {
  return (
    <div className="card">
      <div className="card-body">
        <table className="table table-hover">
          <TableHeader
            columns={columns}
            sortColumn={sortColumn}
            onSort={onSort}
          />
          <TableBody columns={columns} data={data} />
        </table>
      </div>
    </div>
  );
};

export default Table;
