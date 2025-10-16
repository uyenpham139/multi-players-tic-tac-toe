import { Server, Socket } from "socket.io";
import { handleJoinRoom, handleGameMessage } from "./gameLogic";

export function registerSocketHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_room", (data) => handleJoinRoom(io, socket, data));
    socket.on("message", (data) => handleGameMessage(io, socket, data));

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}
