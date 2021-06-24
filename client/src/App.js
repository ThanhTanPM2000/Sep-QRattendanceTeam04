import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/common/protectedRoute";
import "react-toastify/dist/ReactToastify.css";

import Logout from "./components/logout";
import Users from "./components/users";
import NavBar from "./components/NavBar";
import NotFound from "./components/NotFound";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm";
import UserForm from "./components/userForm";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <ToastContainer />
        <NavBar />
        <main className="container-fluid">
          <Switch>
            <Route path="/users/:id" component={UserForm} />
            <Route path="/users" component={Users} />
            <Route path="/register" component={RegisterForm} />
            <Route path="/login" component={LoginForm} />
            <Route path="/logout" component={Logout} />
            {/* <ProtectedRoute path="/semesters" component={} /> */}
            {/* <ProtectedRoute path="/classes" component={Rentals} /> */}
            <Route path="/not-found" component={NotFound} />
            <Redirect from="/" exact to="/users" />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </div>
    );
  }
}

export default App;
