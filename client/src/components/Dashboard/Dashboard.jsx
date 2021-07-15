import React, { Component } from "react";
import { socket, newChatRequest, sendMessage, deleteChatRequest, newMessage, chatRequestComplete, chatRequestIn } from "../../api/chat";

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
      message: ""
    };

    this.setState({username: this.props.username});
    this.checkAuth();

    this.sendMessageH = this.sendMessageH.bind(this);
    this.newChat = this.newChat.bind(this);
  }

  checkAuth() {
    if (!this.state.username) {
      history.push("/");
      window.location.reload();
      return;
    }
  }

  componentDidMount() {
    // socket events
    socket.on("requestDeleteChat", (from, secret) => deleteChatRequest(from, secret));
    socket.on("newMessage", (from, content, iv) => newMessage(from, content, iv));
    socket.on("chatRequestComplete", (from, keys) => chatRequestComplete(from, keys));
    socket.on("newChatRequestIn", (from, keys) => chatRequestIn(from, keys));
    
    window.addEventListener('storage', () => this.setState({}));
  }

  componentWillUnmount() {
    socket.off("requestDeleteChat", (from, secret) => deleteChatRequest(from, secret));
    socket.off("newMessage", (from, content, iv) => newMessage(from, content, iv));
    socket.off("chatRequestComplete", (from, keys) => chatRequestComplete(from, keys));
    socket.off("newChatRequestIn", (from, keys) => chatRequestIn(from, keys));
  
    window.removeEventListener('storage', () => this.setState({}));
  }

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

  sendMessageH() {
    const message = this.state.message;
    
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
                <input
                  type="text"
                  name="message"
                  className="message-text"
                  placeholder="Send a message..."
                  onChange={(e) => this.setState({message: e.target.value})}
                ></input>
                <button
                  className="submit-button"
                  disabled={this.state.currentUser ? false : true}
                  value="Send"
                  onClick={this.sendMessageH}
                ></button>
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
