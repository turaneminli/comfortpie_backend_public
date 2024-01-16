const socketIO = require("socket.io");

let io;
exports.connectSocket = (app) => {
  const server = require("http").createServer(app);
  io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected to socket...");

    socket.on("disconnect", () => {
      console.log("Disconnected...");
    });
  });
  server.listen(8082);
};

exports.emitAlarm = (reason, roomNumber) => {
  console.log(reason, roomNumber);
  if (io) {
    io.emit("alarm", `${reason} alarm in ${roomNumber}`);
  }
};
