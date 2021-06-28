import React from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "../../services/authService";

const ProtectedRoute = ({
  path,
  component: Component,
  render,
  data,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!auth.getCurrentUser())
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location },
              }}
            />
          );
        else if (auth.getCurrentUser().status === "nonRegister")
          return (
            <Redirect
              to={{
                pathname: "/register",
                state: { from: props.location, data },
              }}
            />
          );
        return Component ? <Component {...props} data={data} /> : render(props);
      }}
    />
  );
};

export default ProtectedRoute;
