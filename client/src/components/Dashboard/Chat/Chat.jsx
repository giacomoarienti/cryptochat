import React, { Component } from "react";
import Message from "./Message/Message";

import "./Chat.css";

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: this.props.username,
      chat: [],
    };
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
