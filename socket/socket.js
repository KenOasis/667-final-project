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
    const lobby = this.io.of("lobby");
    const room = this.io.of("room");
    const game = this.io.of("game");
  },
  getNameSpace: (name) => {
    return this.io.of(name);
  },
};
