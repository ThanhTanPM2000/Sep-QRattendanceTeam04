import "./App.css";
import { Route, Redirect, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import NavBar from "./components/NavBar";
import UserForm from "./components/userForm";
import Users from "./components/users";
import Login from "./components/login";
import NotFound from "./components/NotFound";
import Semesters from "./components/semesters";
import SemesterForm from "./components/semesterForm";

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
          <Route path="/semesters/:id" component={SemesterForm} />
          <Route path="/semesters" component={Semesters} />
          <Route path="/not-found" component={NotFound} />
          <Redirect from="/" exact to="/users" />
          <Redirect to="/not-found" />
        </Switch>
      </main>
    </div>
  );
}

export default App;
