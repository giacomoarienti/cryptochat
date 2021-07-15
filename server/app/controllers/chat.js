const { checkUser } = require("./user");

module.exports = function (io) {
  io.on("connection", (socket) => {
    // send a request to create a new chat
    socket.on("newChatRequestOut", (reciver, keys) => {
      if (reciver && reciver != "") {
        if (!checkUser(reciver)) {
          socket
            .to(socket.username)
            .emit("error", { message: "Client not found!" });
        }
        socket
          .to(reciver)
          .emit("newChatRequestIn", { from: socket.username, keys });
      }
    });

    // accept new chat request and complete ecdh
    socket.on("chatRequestAccept", (reciver, key) => {
      if (reciver && reciver != "") {
        if (!checkUser(reciver)) {
          socket
            .to(socket.username)
            .emit("error", { message: "Client not found!" });
        }
        socket
          .to(reciver)
          .emit("chatRequestComplete", { from: socket.username, key });
      }
    });

    // send message
    socket.on("sendMessage", (reciver, message, iv) => {
      if (reciver && reciver != "") {
        if (!checkUser(reciver)) {
          socket
            .to(socket.username)
            .emit("error", { message: "Client not found!" });
        }
        socket
          .to(reciver)
          .emit("reciveMessage", {
            from: socket.username,
            content: message,
            iv,
          });
      }
    });

    // send file
    socket.on("sendFile", (reciver, message, iv) => {
      if (reciver && reciver != "") {
        if (!checkUser(reciver)) {
          socket
            .to(socket.username)
            .emit("error", { message: "Client not found!" });
        }
        socket
          .to(reciver)
          .emit("reciveFile", { from: socket.username, content: message, iv });
      }
    });

    // request chat deletation
    socket.on("requestDeleteChat", (from, secret) => {
      if (reciver && reciver != "") {
        if (!checkUser(reciver)) {
          socket
            .to(socket.username)
            .emit("error", { message: "Client not found!" });
        }
        socket
          .to(reciver)
          .emit("requestDeleteChat", { from: socket.username, secret });
      }
    });
  });
};
