import {
  newECDH,
  completeECDH,
  getKey,
  encrypt,
  decrypt,
} from "../utils/crypto";
import { checkUser } from "./userService";
import { io } from "socket.io-client";

const socket = io();

// create new chat when form is submitted
export const newChatRequest = async (reciver) => {
  if (localStorage.getItem(reciver) !== null) {
    return "Chat already exists";
  }

  let found = await checkUser(reciver);
  if (!found) {
    return "User not found !"
  }

  const [ecdh, keys] = newECDH();

  // new chat event
  socket.emit("newChatRequestOut", {
    reciver: reciver,
    keys,
  });

  localStorage.setItem(
    reciver,
    JSON.stringify({
      chat: [],
      ecdh: ecdh,
      secret: null,
      status: "pending_out",
    })
  );

  return ""
};

// accept an incoming chat request
export const acceptChatRequest = async (reciver, keys) => {
  if (localStorage.getItem(reciver) !== null) {
    return "General error"
  }

  let found = await checkUser(reciver);
  if (!found) {
    return "User not found !"
  }

  const [ecdh, newkeys] = newECDH();
  let secret = completeECDH(ecdh, keys);
  secret = getKey(secret);

  // send the keys
  socket.emit("chatRequestAccept", {
    reciver: reciver,
    newkeys,
  });

  localStorage.setItem(
    reciver,
    JSON.stringify({
      chat: [],
      ecdh: null,
      secret: secret,
      status: "completed",
    })
  );

  return ""
};

// send message
export const sendMessage = (message, user) => {
  let data = localStorage.getItem(user);
  if (data !== null) {
    data = JSON.parse(data);
    const encrypted = encrypt(data.secret, message);

    socket.emit("sendMessage", {
      reciver: user,
      message: encrypted.content,
      iv: encrypted.iv,
    });

    return true;
  }

  return false;
};

// save incoming chat request
export function chatRequestIn() {
  socket.on("newChatRequestIn", (from, keys) => {
    if (localStorage.getItem(from) === null) {
      localStorage.setItem(
        from,
        JSON.stringify({
          chat: [],
          ecdh: keys,
          secret: null,
          status: "pending_in",
        })
      );
    }
  });
}

// complete ECDH
export function chatRequestComplete() {
  socket.on("chatRequestComplete", (from, keys) => {
    let data = localStorage.getItem(from)
    if (data !== null) {
      data = JSON.parse(data);
      let secret = completeECDH(data.ecdh, keys);
      secret = getKey(secret);

      data.ecdh = null;
      data.secret = secret;
      data.status = "completed";
      localStorage.setItem(from, JSON.stringify(data));

      return true;
    }
    return false;
  });

}

// new message recived
export function newMessage() {
  socket.on("newMessage", (from, content, iv) => {
    let data = localStorage.getItem(from)
    if (data !== null) {
      data = JSON.parse(data);
      const decrypted = decrypt(content, data.secret, iv);

      // push the message to the chat history
      data.chat.push({
          type: "message",
          content: decrypted,
          from: from,
      });

      return true;
    }
    return false;
  });
}

/* TODO: to implement
socket.on("reciveFile", (from, content, iv) => {});*/

export function deleteChat(user, secret) {
  localStorage.removeItem(user);
  socket.emit("requestDeleteChat", {user, secret});
}

export function deleteChatRequest() {
  socket.on("requestDeleteChat", (from, secret) => {
    let data = localStorage.getItem(from);
    if(data !== undefined) {
      if(data.status === "completed") {
        data = JSON.parse(data);

        if(data.secret === secret) {
          localStorage.removeItem(from);
        }
      } else {
        localStorage.removeItem(from);
      }
    }
  });
}