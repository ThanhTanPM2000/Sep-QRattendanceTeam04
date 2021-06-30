import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import { useIsAuthenticated } from "@azure/msal-react";

import Login from "./views/Login";
import NotFound from "views/NotFound";
import auth from "./services/authService";
import ProtectedRoute from "./components/common/protectedRoute";
import AdminLayout from "./layouts/Admin";
import { useEffect } from "react";
// import Register from "views/Register";

const App = () => {
  const [user, setUser] = React.useState();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    const newUser = auth.getCurrentUser();
    setUser(newUser);
  }, []);

  return (
    <Switch>
      <Route
        path="/login"
        render={(props) => (
          <Login {...props} data={user} isAuth={isAuthenticated} />
        )}
      />
      <ProtectedRoute
        path="/admin"
        render={(props) => <AdminLayout {...props} />}
        isAuth={isAuthenticated}
      />
      <Route path="/Not-Found" component={NotFound} />
      <Redirect from="/" exact to="/admin/users" />
      <Redirect to="/Not-Found" />
    </Switch>
  );
};

export default App;
