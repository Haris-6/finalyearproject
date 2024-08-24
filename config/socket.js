const { Server } = require("socket.io");
let io;
const userSocketMap = {};

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["POST", "GET"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected: ", socket.id);
    const userId = socket.handshake.query.userId;
    if (userId !== "undefined") {
      userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("A user disconnected: ", socket.id);

      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
};
const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

module.exports = { initializeSocket, getIo,getReceiverSocketId };
