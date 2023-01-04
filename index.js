const express = require("express");
const path = require("path");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = 8000;

const users = {};

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  // if any new users join the chat, let other users connected to the server knows
  socket.on("new-user-joined", (name) => {
    // console.log(name);
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });
  // if someone sends to message then brodcast the message to other peoples
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });
  // if anyone disconnect the chat then broadcast the someone left the chat to other
  socket.on("disconnect", (message) => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});

server.listen(port, () => {
  console.log(`server is running on : http://localhost:${port}`);
});
