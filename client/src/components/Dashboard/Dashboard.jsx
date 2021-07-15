import React, { Component } from "react";
import { newChatRequest, sendMessage } from "../../api/chat";

import Chat from "./Chat/Chat";
import Message from "./Chat/Message/Message";
import SideBar from "./SideBar/SideBar";
import Loading from "../Loading/Loading";
import history from "../../utils/history";

import "./Dashboard.css";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showNewChat: false,
      loading: false,
      currentUser: null,
      errorMessage: "",
      username: null,
    };

    this.sendMessageH = this.sendMessageH.bind(this);
    this.newChat = this.newChat.bind(this);
  }

  componentDidMount() {
    // check authentication
    if (!this.props.username) {
      history.push("/");
      window.location.reload();
      return;
    }

    this.setState({username: this.props.username});
    //window.addEventListener('storage', this.localStorageUpdated)
  }

  componentWillUnmount() {
    //window.removeEventListener()
  }

  // TODO: to implement
  async newChat(event) {
    event.preventDefault();
    const reciver = event.target.username.value;

    if (reciver === this.state.username) {
      this.setState({errorMessage: "Invalid username!"})
      return
    }

    console.log(reciver);
    console.log(this.state.username);

    this.setState({loading: true});

    const error = await newChatRequest(reciver);
    this.setState({errorMessage: error, showNewChat: false, loading: false});
  }

  displayMessage(message, from) {
    const div = document.getElementsByClassName(`chat-${this.state.currentUser}`);
    div.appendChild(<Message type="message" content={message} from={from} />);
  }

  sendMessageH(event) {
    event.preventDefault();
    const message = event.target.message.value;
    
    if(sendMessage(message, this.state.currentUser)) {
      this.displayMessage(message, "me");
    }
  }

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
              {this.state.currentUser && (
                <div className="currentuser"> {this.state.currentUser} </div>
              )}
            </div>

            <div className="new-chat">
              <button
                className="new-chat-button"
                onClick={() => this.setState({showNewChat: !this.state.showNewChat})}
              >
                New Chat
              </button>

              {this.state.showNewChat && (
                <div className="new-chat-div">
                  <form className="new-chat-form" onSubmit={this.newChat}>
                    <label
                      className="new-chat-icon"
                      onClick={() => this.setState({showNewChat: !this.state.showNewChat})}
                    >
                      X
                    </label>
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
              <form onSubmit={this.sendMessageH}>
                <input
                  type="text"
                  name="message"
                  className="message-text"
                  placeholder="Send a message..."
                ></input>
                <input
                  type="submit"
                  className="submit-button"
                  disabled={this.state.currentUser ? false : true}
                  value="Send"
                ></input>
              </form>
            </div>
          </div>

          <div className="chat">
            <Chat username={this.state.currentUser}/>
          </div>
        </div>
      </>
    );
  }
}

export default Dashboard;
