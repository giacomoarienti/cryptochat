const cookie = require('cookie');
const getToken = require('../controllers/auth');


const getUsernameFromToken = (token) => {
  const decoded = getToken(token);
  return decoded.username;
}

// Socket.io middleware, check authentication
module.exports = function (io) {
  io.use((socket, next) => {
    if (socket.handshake.headers.cookie) {
      socket.username = getUsernameFromToken(socket.handshake.headers.cookie);
      socket.id = socket.username;
      if (socket.username) {
        return next();
      }
    }
      
    next(new Error("Unauthenticated!"));
  });
};