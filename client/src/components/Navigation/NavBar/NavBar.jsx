import React from "react";
import RouteLink from "./RouteLink";
import { Link } from "react-router-dom";

import logo from "../../../images/logo.png";

import "./NavBar.css";

function NavBar({ pathname, authed }) {
  return (
    <nav className={`navbar navbar-expand navbar-blue nav`}>
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img className="logo-nav" src={logo} alt="logo" />
        </Link>

        <div className="links">
          <ul className="navbar-nav ml-auto">
            {authed ?
              <>
                <RouteLink name="Chat" href="/dashboard" active={pathname} />
                <RouteLink name="Logout" href="/logout" active={pathname} />
              </>
              :
              <>
                <RouteLink name="Home" href="/" active={pathname} />
                <RouteLink name="Chat" href="/register" active={pathname} />
              </>
            }

          </ul>
        </div>
      </div>
    </nav>

  );
}

export default NavBar;