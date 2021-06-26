import React, { useState, useEffect } from "react";
import LoadingComponent from "react-spinners/ClipLoader";
import "../preLoading.css";

const LoadingPage = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  });

  return (
    <React.Fragment>
      {loading ? (
        // <div id="status" />
        <div id="preloader">
          <LoadingComponent  color="#D0021B" loading={loading} size={50} />
        </div>
      ) : (
        children
      )}
    </React.Fragment>
  );
};

export default LoadingPage;
