import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";

import Login from "./views/Login";
import auth from "./services/authService";
import ProtectedRoute from "./components/common/protectedRoute";
import AdminLayout from "./layouts/Admin";
import { useEffect } from "react";
// import Register from "views/Register";

const App = () => {
  const [user, setUser] = React.useState();

  useEffect(() => {
    const newUser = auth.getCurrentUser();
    setUser(newUser);
  }, []);

  return (
    <Switch>
      <Route
        path="/login"
        render={(props) => <Login {...props} data={user} />}
      />
      <ProtectedRoute
        path="/admin"
        render={(props) => <AdminLayout {...props} />}
      />
      <Redirect from="/" to="/admin/users" />
    </Switch>
  );
};

export default App;
