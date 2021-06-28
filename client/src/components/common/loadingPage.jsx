import React, { useState, useEffect, useRef } from "react";
import LoadingComponent from "react-spinners/ClipLoader";
import "../../assets/css/preLoading.css";

const LoadingPage = ({ data, children }) => {
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (data.length !== 0) {
        setLoading(false);
      }
    });
    return () => {
      clearInterval(intervalRef.current);
    };
  });

  return (
    <React.Fragment>
      {loading ? (
        // <div id="status" />
        <div id="preloader">
          <LoadingComponent color="#D0021B" loading={loading} size={50} />
        </div>
      ) : (
        children
      )}
    </React.Fragment>
  );
};

export default LoadingPage;
