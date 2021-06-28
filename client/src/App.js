import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Login from "./views/Login";
import auth from "./services/authService";
import ProtectedRoute from "./components/common/protectedRoute";
import AdminLayout from "./layouts/Admin";
import { useEffect } from "react";

const App = () => {
  const [user, setUser] = React.useState();

  useEffect(() => {
    const newUser = auth.getCurrentUser();
    setUser(newUser);
  }, []);

  return (
    <Switch>
      <Route path="/login" render={(props) => <Login {...props} />} />
      <ProtectedRoute
        path="/admin"
        render={(props) => <AdminLayout {...props} />}
      />
      <Redirect from="/" to="/admin/users" />
    </Switch>
  );
};

export default App;
