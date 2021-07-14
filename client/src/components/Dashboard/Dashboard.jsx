import React, { useState, useEffect } from "react";
import {
  newDF,
  completeDF,
  reciveDF,
  getKey,
  encrypt,
  decrypt,
} from "../../utils/crypto";
import { checkUser } from "../../api/userService";
import { io } from "socket.io-client";

import Chat from "./Chat/Chat";
import SideBar from "./SideBar/SideBar";
import Loading from "../Loading/Loading";
import history from "../../utils/history";

import "./Dashboard.css";

function Dashboard({ username }) {
  // check authentication
  useEffect(() => {
    if (!username) {
      history.push("/");
      window.location.reload();
      return;
    }
  }, [username]);

  let users = [];
  const [showNewChat, setShowNewChat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [errorMessage, setErrorMessage] = useState();

  // Socket
  const socket = io();

  // create new chat when form is submitted
  const newChat = async (event) => {
    event.preventDefault();
    const reciver = event.target.username.value;

    console.log(reciver);

    if (reciver === username) {
      return setErrorMessage("Invalid user");
    }

    let found = await checkUser(reciver);
    if (!found) {
      return setErrorMessage("User not found !");
    }

    setLoading(true);

    const [generator, message] = newDF();

    console.log(message);

    // new chat event
    socket.emit("newChat", {
      reciver: reciver,
      p: message.p,
      g: message.g,
      A: message.A,
    });


    users.push({ username: reciver, chat: [], df: generator, key: null });
    console.log(users);

    setLoading(false);
    setShowNewChat(false);
  };

  // send message
  const sendMessage = (event) => {
    event.preventDefault();
    const message = event.target.message.value;

    for (var i = 0; i < users.length; i++) {
      if (users[i].username === currentUser) {
        const encrypted = encrypt(users[i].key, message);

        socket.emit("sendMessage", {
          reciver: currentUser,
          message: encrypted.content,
          iv: encrypted.iv,
        });
      }
    }
  };

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


  useEffect(() => {return}, [users]);

  /*
  Components:
  - SideBar
  - Chat
  - Send Message
  - new Chat
  */
  return (
    <div className="dashboard">
      {loading && <Loading />}

      {errorMessage && (
        <div className="error-message">
          <div
            className="alert text-center alert-danger"
            role="alert"
            onClick={() => setErrorMessage("")}
          >
            {errorMessage}
          </div>
        </div>
      )}

      <span className="side-bar-toggle"></span>
      <div className="side-bar">
        {users.forEach((user) => {
          <SideBar
            username={user.username}
            onClick={() => setCurrentUser(user.username)}
          />;
        })}
      </div>

      <div className="user-info">
        <div className="username-info">
          {currentUser && <div className="currentuser"> {currentUser} </div>}
        </div>

        <div className="new-chat">
          <button
            className="new-chat-button"
            onClick={() => setShowNewChat(!showNewChat)}
          >
            New Chat
          </button>

          {showNewChat && (
            <div className="new-chat-div">
              <form className="new-chat-form" onSubmit={newChat}>
                <a className="new-chat-icon" onClick={() => setShowNewChat(!showNewChat)} >X</a>
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
            <input type="submit" className="submit-button" disabled={currentUser ? false : true} value="Send"></input>
          </form>
        </div>
      </div>

      <div className="chat">
        {users.forEach((user) => {
          currentUser === user.username && (
            <Chat username={user.username} chat={user.chat} />
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
