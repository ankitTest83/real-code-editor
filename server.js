const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const socketActions = require("./src/socketAction");

const server = http.createServer(app);

const io = new Server(server);

const userSocketMap = {};

app.use(express.static("build"));
app.use((req, res, next) => {
  console.log(
    "testing app use -> ",
    path.join(__dirname, "build", "index.html")
  );
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const getAllConectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        userName: userSocketMap[socketId],
      };
    }
  );
};

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);
  socket.on(socketActions.JOIN, ({ roomId, userName }) => {
    userSocketMap[socket.id] = userName;
    socket.join(roomId);

    const clients = getAllConectedClients(roomId);
    console.log("all clients ==> ", clients);
    console.log("all rooms --> ");
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(socketActions.JOINED, {
        clients,
        userName,
        soketId: socket.id,
      });
    });
  });

  socket.on(socketActions.CODE_CHANGE, ({ roomId, code }) => {
    console.log("code changed server side log", code);
    socket
      .in(roomId)
      .emit(socketActions.CODE_CHANGE, { code, socketId: socket.id });
  });

  socket.on(socketActions.SYNC_CODE, ({ socketId, code }) => {
    console.log("code synced server side log", code);
    if (code) {
      io.to(socketId).emit(socketActions.CODE_CHANGE, {
        code,
        socketId: socket.id,
      });
    }
  });

  // typing
  // socket.on(socketActions.TYPING, ({ roomId, socketId }) => {
  //   console.log("TYPING ACTIONG CALL socketId", { roomId, socketId });
  //   socket.in(roomId).emit(socketActions.TYPING, { socketId });
  // });

  // client disconnecting
  socket.on("disconnecting", () => {
    console.log(" all romms", [...socket.rooms]);
    const allRooms = [...socket.rooms];
    allRooms.forEach((roomId) => {
      socket.in(roomId).emit(socketActions.DISCONNECTED, {
        userName: userSocketMap[socket.id],
        socketId: socket.id,
      });
    });

    delete userSocketMap[socket.id];
    socket.leave();
  });
});

//const PORT = process.env.PORT || 5000;
server.listen(process.env.PORT || 5000, () => {
  console.log(`Listening on port ${process.env.PORT || 5000}`);
});
