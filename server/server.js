require("dotenv").config();

const express = require("express");
const app = express();

const cors = require("cors");
const cookieParser = require("cookie-parser");

var corsOptions = {
  origin: [process.env.CORS],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.status(200).send();
});

require("./app/routes/user")(app);
require("./app/routes/file")(app);

// Socket.io
const server = require('http').createServer(app)
const io = require("socket.io")(server, {
  path: "/chat",
  pingInterval: 10000,
  pingTimeout: 5000,
  cors: {
    origin: [process.env.CORS],
  },
});

require("./app/middleware/socket")(io);
require("./app/controllers/chat")(io);


const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Server started on port ${port} 🚀`);
});
