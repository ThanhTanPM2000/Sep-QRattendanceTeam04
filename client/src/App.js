import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import Users from "./components/users";
import NavBar from "./components/NavBar";
import NotFound from "./components/NotFound";
import "./App.css";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <NavBar />
        <Switch>
          <Route path="/" component={Users} />
          <Route path="/users/:id" />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="/not-found" />
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;

