import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import { useIsAuthenticated } from "@azure/msal-react";

import Login from "./views/Login";
import NotFound from "views/NotFound";
import auth from "./services/authService";
import ProtectedRoute from "./components/common/protectedRoute";
import AdminLayout from "./layouts/Admin";
import { useEffect } from "react";
import Register from "views/Register";
// import Register from "views/Register";

const App = () => {
  return (
    <Switch>
      <ProtectedRoute
        path="/admin"
        render={(props) => <AdminLayout {...props} />}
      />
      <Redirect from="/" exact to="/admin/users" />
      {auth.getCurrentUser() && (
        <Route path="/register" render={(props) => <Register {...props} />} />
      )}
      <Route path="/login" render={(props) => <Login {...props} />} />
      <Route path="/Not-Found" component={NotFound} />
      <Redirect to="/Not-Found" />
    </Switch>
  );
};

export default App;
