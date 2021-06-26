import logo from "./logo.svg";
import "./App.css";
import { Route, Redirect, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import NavBar from "./components/navBar";
import UserForm from "./components/userForm";
import Users from "./components/users";
import Login from "./components/login";
import notFound from "./components/notFound";

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <NavBar />
      <main className="container-fluid">
        <Switch>
          <Route path="/users/:id" component={UserForm} />
          <Route path="/users" component={Users} />
          <Route path="/login" component={Login} />
          <Route path="/not-found" component={notFound} />
          <Redirect from="/" exact to="/users" />
          <Redirect to="/not-found" />
        </Switch>
      </main>
    </div>
  );
}

export default App;
