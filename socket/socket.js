let io;
module.exports = {
  init: (httpServer) => {
    this.io = require("socket.io")(httpServer);
    return this.io;
  },
  getIO: () => {
    if (!this.io) {
      throw new Error("Socket.io not initialized!");
    }
    return this.io;
  },
  initNameSpace: () => {
    this.io.of("lobby");
    this.io.of("game");
  },
  getNameSpace: (name) => {
    return this.io.of(name);
  },
};
