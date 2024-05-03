const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const ACTIONS = require("../src/action");
const { SocketAddress } = require("net");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const server = http.createServer(app);
const io = new Server(server);

// app.use(express.static("build"));
// app.use((req, res, next) => {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const getAllConnectedClients = (roomId) => {
  // console.log("rid", roomId);
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      // console.log(socketId);
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
};

const userSocketMap = {};

io.on("connection", (socket) => {
  // console.log("socket connected", socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    // console.log(userSocketMap);
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    // console.log(clients);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        newUsername: username,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    // console.log(roomId, code);
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ code, selectedLanguage, socketId }) => {
    // console.log(code, selectedLanguage, socketId);
    io.to(socketId).emit(ACTIONS.SYNC_CODE, { code, selectedLanguage });
  });

  socket.on(ACTIONS.LANGUAGE_CHANGE, ({ roomId, language }) => {
    // console.log("lang", roomId, language);
    socket.in(roomId).emit(ACTIONS.LANGUAGE_CHANGE, { language });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    // console.log(socket.id, userSocketMap[socket.id]);

    rooms.forEach((room) => {
      socket.in(room).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        leaveUsername: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
