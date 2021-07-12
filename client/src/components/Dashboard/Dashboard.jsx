import React, { Component } from "react";
import history from "../../utils/history";

import "./Dashboard.css";

class Dashboard extends Component {
  state = {
    username: null
  }

  componentDidMount() {
    // Check if user is authenticated
    if (!this.props.username) {
      history.push("/");
      window.location.reload();
      return;
    }

    this.setState({ username: this.props.username });
  }


  render() {
    return (
      <div className="dashboard">
        <div className="container">
          <h1 className="font-weight-light">Welcome</h1>
          <h3 className="font-weight-light">{this.state.username}</h3>
          <p className="test"></p>
        </div>
      </div>
    );
  }
}

export default Dashboard;