import React from "react";
import { Link, NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">
        QrCode VanLang
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#menu"
        aria-controls="navbarNavAltMarkup"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div
        className="collapse navbar-collapse in"
        id="menu"
        style={{ height: "auto" }}
      >
        <div className="nav navbar-nav">
          <NavLink className="nav-item nav-link" to="/users">
            Users
          </NavLink>
          <NavLink className="nav-item nav-link" to="/login">
            Login
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
