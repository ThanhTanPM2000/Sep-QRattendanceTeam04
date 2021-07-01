import React, { useState, useEffect, useRef } from "react";
import LoadingComponent from "react-spinners/ClipLoader";

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
        <LoadingComponent color="#D0021B" loading={loading} size={50} />
      ) : (
        children
      )}
    </React.Fragment>
  );
};

export default LoadingPage;
