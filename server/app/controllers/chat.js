module.exports = function (io) {
  io.on("connection", (socket) => {
    
    // create new chat
    socket.on("newChat", (reciver, p, g, A) => {
      if(reciver && reciver != "") {
        socket.to(reciver).emit("newChat", {from: socket.username, p, g, A});
      }
    });

    // complete E2E enc
    socket.on("newChatComplete", (reciver, B) => {
      if(reciver && reciver != "") {
        socket.to(reciver).emit("newChat", {from: socket.username, B});
      }
    });

    // send message
    socket.on("sendMessage", (reciver,message,iv) => {
      if(reciver && reciver != "") {
        socket.to(reciver).emit("sendMessage", {from: socket.username, message, iv});
      }
    });
  
  });
}