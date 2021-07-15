import React, { Component } from "react";
import { chatRequestIn,  chatRequestComplete, newMessage, deleteChatRequest } from "../../../api/chat";
import Message from "./Message/Message";

import "./Chat.css";

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: this.props.username,
      chat: [],
    };

    chatRequestIn();
    chatRequestComplete();
    newMessage();
    deleteChatRequest();
  }

  componentDidMount() {
    let data = localStorage.getItem(this.state.username);
    if (data === null) {
      return;
    }

    data = JSON.parse(data);
    const chat = data.chat;

    this.setState({ chat: chat });
  }

  render() {
    return (
      <div className={`chat-${this.state.username}`}>
        {this.state.chat.forEach((c) => {
          <Message type={c.type} content={c.content} from={c.from} />;
        })}
      </div>
    );
  }
}

export default Chat;
