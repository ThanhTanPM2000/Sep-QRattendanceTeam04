import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";

import Users from "./components/users";
import NavBar from "./components/NavBar";
import NotFound from "./components/NotFound";
import LoginForm from "./components/loginForm";
import UserForm from "./components/userForm";
import "./App.css";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <NavBar />
        <main className="container-fluid">
          <Switch>
            <Route path="/users/:id" component={UserForm} />
            <Route path="/login" component={LoginForm} />
            <Route path="/" component={Users} />
            <Route path="/not-found" component={NotFound} />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
