import React from "react";
import LoadingComponent from "react-spinners/ClipLoader";

const LoadingPage = ({ isLoading, children }) => {
  return (
    <React.Fragment>
      {isLoading ? (
        <LoadingComponent color="#D0021B" loading={isLoading} size={50} />
      ) : (
        children
      )}
    </React.Fragment>
  );
};

export default LoadingPage;
