import React, { useState, useEffect } from "react";
import {newDF, completeDF, reciveDF, getKey, encrypt, decrypt} from "../../../utils/crypto";
import { io } from "socket.io-client";

import Chat from "./Chat/Chat";
import SideBar from "./SideBar/SideBar";
import history from "../../utils/history";

import "./Dashboard.css";

function Dashboard({ username }) {
  // check authentication
  if (!username) {
    history.push("/");
    window.location.reload();
    return;
  }

  const users = [];
  const [newChat, setNewChat] = useState(false);
  const [currentUser, setCurrentUser] = useState();

  // Socket
  const socket = io();

  // create new chat when form is submitted
  const newChat = (event) => {
    event.preventDefault();
    const reciver = event.target.username.value;

    const [generator, message] = newDF();

    // new chat event
    socket.emit("newChat", {
      reciver: reciver,
      p: message.p,
      g: message.g,
      A: message.A,
    });

    users.push({ username: reciver, chat: [], df: generator, key: null });
  };

  // send message
  const sendMessage = (event) => {
    event.preventDefault();
    const message = event.target.message.value;

    for (var i = 0; i < users.length; i++) {
      if (users[i].username === currentUser) {
        const encrypted = encrypt(users[i].key, message);

        socket.emit("sendMessage", {reciver: currentUser, message: encrypted.content, iv: encrypted.iv});
      }
    }
  }

  // listen for incoming events
  useEffect(() => {
    // respond to DH
    socket.on("newChat", (from, p, g, A) => {
      const message = reciveDF({ p, g, A });
      const K = getKey(message.K);

      users.push({ username: from, chat: [], df: null, key: K });

      socket.emit("newChatComplete", { reciver: from, B: message.B });
    });

    // complete DF
    socket.on("newChatComplete", (from, B) => {
      for (var i = 0; i < users.length; i++) {
        if (users[i].username === from) {
          const K = completeDF(users[i].df, B);
          users[i].key = getKey(K);
        }
      }
    });

    // new message recived
    socket.on("newMessage", (from, content, iv) => {
      for (var i = 0; i < users.length; i++) {
        if (users[i].username === from) {
          const decrypted = decrypt(content, users[i].key, iv);
          
          // push the message to the chat history
          users[i].chat.push({
            type: "message",
            content: decrypted,
            from: from,
          });
        }
      }
    });

    // TODO: to implement
    socket.on("newFile", (from, content, iv) => {});
  }, [socket]);

  /*
  Components:
  - SideBar
  - Chat
  - Send Message
  - new Chat
  */
  return (
    <div className="dashboard">
      <div className="side-bar">
        {this.state.users.forEach((user) => {
          <SideBar
            username={user.username}
            onClick={setCurrentUser(user.username)}
          />;
        })}
      </div>

      <div className="new-chat">
        <button className="new-chat-button" onClick={setNewChat(!newChat)}>New Chat</button>

        {newChat && (
          <form className="new-chat-form" onSubmit={this.newChat()}>
            <input type="text" className="new-chat-input" placeholder="Username"></input>
            <input type="submit" className="new-chat-submit" value="Send" name="reciver"></input>
          </form>
        )}
      </div>

      <div className="chat">
        {this.state.users.forEach((user) => {
          this.state.currentUser === user.username && (
            <Chat
              username={user.username}
              chat={user.chat}
            />
          );
        })}
      </div>

      <div className="send-message">
        <form onSubmit={this.sendMessage()}>
          <input type="text" name="message" className="message-text" placeholder="Send a message..."></input>
          <input type="submit" className="sumbit-button" value="Send"></input>
        </form>
      </div>
    </div>
  );
}

export default Dashboard;
