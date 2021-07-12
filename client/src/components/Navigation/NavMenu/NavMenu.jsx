import React, { Component } from "react";
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavItem,
  MDBNavbarToggler,
  MDBCollapse,
  MDBContainer,
} from "mdbreact";
import RouteLink from "./RouteLink";

import logo from "../../../images/logo.png";

import "./NavMenu.css";

class hamburgerMenuPage extends Component {
  state = {
    collapseID: "",
  };

  toggleCollapse = (collapseID) => () => {
    this.setState((prevState) => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : "",
    }));
  };

  render() {
    return (
      <MDBContainer>
        <MDBNavbar color="light-blue lighten-4" className="navmenu" light>
          <MDBContainer>
            <MDBNavbarBrand>
              <img className="logo-nav" src={logo} alt="logo" />
            </MDBNavbarBrand>
            <MDBNavbarToggler
              onClick={this.toggleCollapse("navbarCollapse1")}
            />
            <MDBCollapse
              id="navbarCollapse1"
              isOpen={this.state.collapseID}
              navbar
            >
              <MDBNavbarNav>
                {this.props.authed ? (
                  <>
                    <MDBNavItem>
                      <RouteLink
                        name="Chat"
                        href="/dashboard"
                        active={this.props.pathname}
                      />
                    </MDBNavItem>
                    <MDBNavItem>
                      <RouteLink
                        name="Logout"
                        href="/logout"
                        active={this.props.pathname}
                      />
                    </MDBNavItem>
                  </>
                ) : (
                  <>
                    <MDBNavItem>
                      <RouteLink
                        name="Home"
                        href="/"
                        active={this.props.pathname}
                      />
                    </MDBNavItem>
                    <MDBNavItem>
                      <RouteLink
                        name="Chat"
                        href="/register"
                        active={this.props.pathname}
                      />
                    </MDBNavItem>
                  </>
                )}
              </MDBNavbarNav>
            </MDBCollapse>
          </MDBContainer>
        </MDBNavbar>
      </MDBContainer>
    );
  }
}

export default hamburgerMenuPage;
