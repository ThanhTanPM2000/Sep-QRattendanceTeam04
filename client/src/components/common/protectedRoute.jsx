import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({
  path,
  component: Component,
  render,
  isAuth,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAuth)
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location },
              }}
            />
          );
        return Component ? <Component {...props} /> : render(props);
      }}
    />
  );
};

export default ProtectedRoute;
