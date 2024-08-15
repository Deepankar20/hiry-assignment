import { Server } from "socket.io";

class SocketService {
  private _io: Server;

  constructor() {
    console.log("Init socket service...");

    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
  }

  private users: {} = {};

  public initListeners() {
    const io = this.io;

    io.on("connect", (socket) => {
      console.log("New socket connected : ", socket.id);
      const token = socket.handshake.query.userToken;

      
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
