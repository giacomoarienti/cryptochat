import React, { Component } from "react";

import Chat from "./Chat/Chat";
import SideBar from "./SideBar/SideBar";
import Loading from "../Loading/Loading";
import history from "../../utils/history";

import "./Dashboard.css";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.newChat = this.newChat.bind(this);
    this.sendMessage = this.sendMessage.bind(this);

    this.state = {
      showNewChat: false,
      loading: false,
      currentUser: null,
      errorMessage: "",
      username: this.props.username,
    };
  }

  componentDidMount() {
    // check authentication
    if (!this.state.username) {
      history.push("/");
      window.location.reload();
      return;
    }
  }

  // TODO: to implement
  newChat() {

  }

  sendMessage() {

  }

  //window.addEventListener('storage', this.localStorageUpdated)

  /*
  Components:
  - SideBar
  - Chat
  - Send Message
  - new Chat
  */
  render() {
    return (
      <>
        {this.state.loading && <Loading />}

        <div className="dashboard">
          {this.state.errorMessage && (
            <div className="error-message">
              <div
                className="alert text-center alert-danger"
                role="alert"
                onClick={() => this.setState({errorMessage:""})}
              >
                {this.state.errorMessage}
              </div>
            </div>
          )}

          <div className="side-bar">
            <SideBar
              setUser={user => this.setState({currentUser: user})}
              setError={error => this.setState({errorMessage: error})}
            />
          </div>

          <div className="user-info">
            <div className="username-info">
              {currentUser && (
                <div className="currentuser"> {currentUser} </div>
              )}
            </div>

            <div className="new-chat">
              <button
                className="new-chat-button"
                onClick={() => this.setState({showNewChat: !showNewChat})}
              >
                New Chat
              </button>

              {showNewChat && (
                <div className="new-chat-div">
                  <form className="new-chat-form" onSubmit={newChat}>
                    <a
                      className="new-chat-icon"
                      onClick={() => this.setState({showNewChat: !showNewChat})}
                    >
                      X
                    </a>
                    <div className="new-chat-flex">
                      <label className="new-chat-label">Username</label>
                      <input
                        type="text"
                        name="username"
                        className="new-chat-input"
                        placeholder="Username"
                      ></input>
                      <input
                        type="submit"
                        className="new-chat-submit"
                        value="Send"
                        name="reciver"
                      ></input>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          <div className="send-text">
            <div className="send-message">
              <form onSubmit={sendMessage}>
                <input
                  type="text"
                  name="message"
                  className="message-text"
                  placeholder="Send a message..."
                ></input>
                <input
                  type="submit"
                  className="submit-button"
                  disabled={currentUser ? false : true}
                  value="Send"
                ></input>
              </form>
            </div>
          </div>

          <div className="chat">
            <Chat username={currentUser}/>
          </div>
        </div>
      </>
    );
  }
}

export default Dashboard;
