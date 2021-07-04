import React from "react";
import _ from "lodash";

const tableBody = ({ columns, data }) => {
  const renderCall = (item, column) => {
    if (column.content) return column.content(item);

    return _.get(item, column.path);
  };

  const createKey = (item, column) => {
    return item._id + (column.path || column.key);
  };

  return (
    <tbody>
      {data.map((item) => (
        <tr key={item._id}>
          {columns.map((column) => (
            <td key={createKey(item, column)}>{renderCall(item, column)}</td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default tableBody;
