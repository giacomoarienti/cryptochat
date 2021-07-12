import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import NavMenu from "./NavMenu/NavMenu.jsx";
import NavBar from "./NavBar/NavBar.jsx"

import "./Navigation.css";

class Navigation extends Component {
  render() {
    return(
      <header>
        <div className="navigation">
          <NavMenu className="navmenu" authed={this.props.authed} pathname={this.props.location.pathname} />
          <NavBar className="navbar" authed={this.props.authed} pathname={this.props.location.pathname} />
          <hr className="separator" />
        </div>
      </header>
    );
  }
}

export default withRouter(Navigation);