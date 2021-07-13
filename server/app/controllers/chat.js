const {checkUser} = require('./user')

module.exports = function (io) {
  io.on("connection", (socket) => {    
    // create new chat
    socket.on("newChat", (reciver, p, g, A) => {
      if(reciver && reciver != "") {
        if(!checkUser(reciver)) {
          socket.to(socket.username).emit("error", {message: "Client not found!"});
        }
        socket.to(reciver).emit("newChat", {from: socket.username, p, g, A});
      }
    });

    // complete E2E enc
    socket.on("newChatComplete", (reciver, B) => {
      if(reciver && reciver != "") {
        if(!checkUser(reciver)) {
          socket.to(socket.username).emit("error", {message: "Client not found!"});
        }
        socket.to(reciver).emit("newChatComplete", {from: socket.username, B});
      }
    });

    // send message
    socket.on("sendMessage", (reciver,message,iv) => {
      if(reciver && reciver != "") {
        if(!checkUser(reciver)) {
          socket.to(socket.username).emit("error", {message: "Client not found!"});
        }
        socket.to(reciver).emit("newMessage", {from: socket.username, content: message, iv});
      }
    });

    // send file
    socket.on("sendFile", (reciver,message,iv) => {
      if(reciver && reciver != "") {
        if(!checkUser(reciver)) {
          socket.to(socket.username).emit("error", {message: "Client not found!"});
        }
        socket.to(reciver).emit("newFile", {from: socket.username, content: message, iv});
      }
    });
  
  });
}