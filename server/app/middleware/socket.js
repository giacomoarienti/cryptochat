const jwt = require("jsonwebtoken");
const jwtsecret = require("../config/auth");

// Socket.io middleware, check authentication
module.exports = function (io) {
  io.use((socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {
      jwt.verify(socket.handshake.auth.token, jwtsecret, (err, decoded) => {
        if (err) {
          return next(new Error("Unauthenticated!"));
        }
    
        socket.username = decoded.username;
      });
    }

    if (socket.username) {
      return next();
    }

    next(new Error("Unauthenticated!"));
  });
};
