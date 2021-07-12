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

require("./app/routes/auth")(app);
require("./app/routes/user")(app);

// Socket.io
const server = require('http').createServer(app)
const io = require("socket.io")(server, {
  cors: {
    origin: [process.env.CORS],
  },
});

require("./app/middleware/socket")(io);
require("./app/controllers/chat")(io);


const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server started on port ${port} 🚀`);
});
