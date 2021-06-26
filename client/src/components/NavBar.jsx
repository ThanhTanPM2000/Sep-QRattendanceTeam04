import React from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { Link, NavLink } from "react-router-dom";

const NavBar = () => {
  const isAuthenticated = useIsAuthenticated();
  return (
    <nav className="navbar navbar-expand-lg navbar-light mb-3">
      <div className="container">
        <Link className="navbar-brand" to="/">
          VanLang QrCode
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav ml-auto">
            {!isAuthenticated && (
              <React.Fragment>
                <li className="nav-item">
                  <NavLink className="nav-item nav-link" to="/login">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-item nav-link" to="/register">
                    Register
                  </NavLink>
                </li>
              </React.Fragment>
            )}
            {isAuthenticated && (
              <React.Fragment>
                <li className="nav-item">
                  <NavLink className="nav-item nav-link" to="/users">
                    Users
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-item nav-link" to="/semester">
                    semester
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-item nav-link" to="/rentals">
                    Rentals
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-item nav-link" to="/profile">
                    Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink className="nav-item nav-link" to="/logout">
                    Logout
                  </NavLink>
                </li>
              </React.Fragment>
            )}
            <li className="nav-item"></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

