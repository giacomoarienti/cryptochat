import React, { Component } from "react";

import { registerUser } from "../../api/userService";
import history from "../../utils/history";

import "./Register.css";

class Register extends Component {
  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
   
    this.state = {
      username: "",
      successful: false,
      message: "",
    };
  }

  async handleRegister(e) {
    e.preventDefault();

    this.setState({
      message: "",
      successful: false,
    });

    const response = await registerUser(this.state.username);
    if ("error" in response) {
      this.setState({
        successful: false,
        message: response.error,
      });
    } else {
      this.setState({
        message: response.message,
        successful: true,
      });
      
      history.push("/dashboard");
      window.location.reload();
    }
  }

  render() {
    return (
      <div className="register">
        <div className="container py-2">
          <div className="row">
            <div className="col-md-5 mx-auto">
              <div className="card p-4">
                <div className="myform form ">
                  <div className="logo mb-3">
                    <div className="col-md-12 text-center">
                      <h4 className="pt-1">Register</h4>
                    </div>
                  </div>

                  <form onSubmit={this.handleRegister}>
                    <div className="form-group">
                      {this.state.message && (
                        <div className="form-group">
                          <div
                            className={
                              this.state.successful
                                ? "alert text-center alert-success"
                                : "alert text-center alert-danger"
                            }
                            role="alert"
                          >
                            {this.state.message}
                          </div>
                        </div>
                      )}
                      <label>Username</label>
                      <input
                        type="text"
                        name="username"
                        value={this.state.username}
                        id="name"
                        placeholder="Enter username"
                        onChange={(e) => this.setState({ username: e.target.value})}
                      />
                    </div>

                    <div className="col-md-12 text-center ">
                      <button
                        type="submit"
                        className="btn btn-block mybtn tx-tfm"
                        disabled={this.state.loading}
                      >
                        Register
                      </button>
                      {this.state.loading && (
                        <span className="spinner-border spinner-border-sm"></span>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
