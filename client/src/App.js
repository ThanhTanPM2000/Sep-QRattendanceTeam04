import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Login from "./views/Login";
import NotFound from "views/NotFound";
import auth from "./services/authService";
import ProtectedRoute from "./components/common/protectedRoute";
import AdminLayout from "./layouts/Admin";
import Register from "views/Register";


const App = () => {
  return (
    <React.Fragment>
      <div className="rna-container">
        <ToastContainer />
      </div>
      <Switch>
        {!auth.getCurrentUser?._id && (
          <Route path="/register" render={(props) => <Register {...props} />} />
        )}

        <ProtectedRoute
          path="/admin"
          render={(props) => <AdminLayout {...props} />}
        />
        <Route path="/login" render={(props) => <Login {...props} />} />
        <Redirect from="/" exact to="/admin/classes" />
        <Route path="/Not-Found" component={NotFound} />
        <Redirect to="/Not-Found" />
      </Switch>
    </React.Fragment>
  );
};

export default App;
