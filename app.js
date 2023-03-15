require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Global Middlewares
app.use(express.json());
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});
app.use(express.static(path.join(__dirname, "public")));

// Set Engine
app.set("view engine", "ejs");

// Routes
app.use("", require("./routes"));
app.get("**", async (req, res) => res.sendStatus(401));

// Socket io
io.on("connection", (socket) => {
  let name;
  socket.on("new-user", (msg) => {
    name = msg;
    socket.broadcast.emit("chat-user", `${name} joined chat!`);
  });
  socket.on("chat-message", (msg) => {
    io.emit("chat-message", msg);
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("chat-user", `${name} left chat!`);
  });
});
// Start app
const port = process.env.PORT || 3001;
server.listen(port, () => console.log(`Server started on port ${port}`));
