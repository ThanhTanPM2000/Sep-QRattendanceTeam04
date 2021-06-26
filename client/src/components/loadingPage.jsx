import React, { useState, useEffect } from "react";
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
        <div id="preloader">
          <div id="status" />
        </div>
      ) : (
        children
      )}
    </React.Fragment>
  );
};

export default LoadingPage;
