import React from "react";
import { Route, Redirect } from "react-router-dom";

import auth from "../../services/authService";

const ProtectedRoute = ({ path, component: Component, render, ...rest }) => {
  return (
    <React.Fragment>
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
          else if (auth.getCurrentUser() && !auth.getCurrentUser()?._id) {
            return <Redirect to={{ pathname: "/register" }} />;
          }
          return Component ? <Component {...props} /> : render(props);
        }}
      />
    </React.Fragment>
  );
};

export default ProtectedRoute;
