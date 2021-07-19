const { checkUser } = require("./user");

module.exports = function (io) {
  let users = [];

  io.on("connection", (socket) => {
    users[socket.username] = socket.id;

    // pmake sure users is online
    socket.on("disconnect", (reason) => {
      delete users[socket.username];
    });

    // send a request to create a new chat
    socket.on("newChatRequestOut", ({ reciver, keys }) => {
      if (reciver && reciver !== "") {
        if (!checkUser(reciver)) {
          io.to(socket.id).emit("error", { message: "Client not found!" });
        }

        if (!users[reciver]) {
          io.to(socket.id).emit("error", { message: "Client not online!" });
        }

        io.to(users[reciver]).emit("newChatRequestIn", {
          from: socket.username,
          keys: keys,
        });
      }
    });

    // accept new chat request and complete ecdh
    socket.on("chatRequestAccept", ({ reciver, keys }) => {
      if (reciver && reciver !== "") {
        if (!checkUser(reciver)) {
          io.to(socket.id).emit("error", { message: "Client not found!" });
        }

        if (!users[reciver]) {
          io.to(socket.id).emit("error", { message: "Client not online!" });
        }

        io.to(users[reciver]).emit("chatRequestComplete", {
          from: socket.username,
          keys,
        });
      }
    });

    // send message
    socket.on("sendMessage", ({ reciver, message, iv }) => {
      if (reciver && reciver !== "") {
        if (!checkUser(reciver)) {
          io.to(socket.id).emit("error", { message: "Client not found!" });
        }

        if (!users[reciver]) {
          io.to(socket.id).emit("error", { message: "Client not online!" });
        }

        io.to(users[reciver]).emit("reciveMessage", {
          from: socket.username,
          content: message,
          iv,
        });
      }
    });

    // send file
    socket.on("sendFile", ({ reciver, message, iv }) => {
      if (reciver && reciver !== "") {
        if (!checkUser(reciver)) {
          io.to(socket.id).emit("error", { message: "Client not found!" });
        }

        if (!users[reciver]) {
          io.to(socket.id).emit("error", { message: "Client not online!" });
        }

        io.to(users[reciver])
          .to(reciver)
          .emit("reciveFile", { from: socket.username, content: message, iv });
      }
    });

    // request chat deletation
    socket.on("requestDeleteChat", ({ reciver, secret }) => {
      if (reciver && reciver !== "") {
        if (!checkUser(reciver)) {
          io.to(socket.id).emit("error", { message: "Client not found!" });
        }

        if (!users[reciver]) {
          io.to(socket.id).emit("error", { message: "Client not online!" });
        }

        io.to(users[reciver]).emit("requestDeleteChat", {
          from: socket.username,
          secret,
        });
      }
    });
  });
};
