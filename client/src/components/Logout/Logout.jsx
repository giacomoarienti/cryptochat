import React, { Component } from "react";
import { logoutUser } from "../../api/userService";
import history from "../../utils/history";

class Logout extends Component {
  async componentDidMount() {
    await logoutUser();

    history.push("/");
    window.location.reload();
    return null;
  }

  render() {
    return (
      <></>
    );
  }
}

export default Logout;
