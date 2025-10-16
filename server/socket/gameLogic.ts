import { Server, Socket } from "socket.io";
import { getOrCreateRoom, addPlayerToRoom } from "./roomManager";

export function handleJoinRoom(io: Server, socket: Socket, { roomId }: { roomId: string }) {
  const room = getOrCreateRoom(roomId);
  const player = room ? addPlayerToRoom(room, socket.id) : null

  socket.join(roomId);
  socket.emit("message", { type: "PLAYER_ASSIGNED", player: player.role, board: room.board });
  io.to(roomId).emit("message", { type: "STATUS", message: `${player.role} joined room ${roomId}` });
}

export function handleGameMessage(io: Server, socket: Socket, { type, square, roomId }: any) {
  const room = getOrCreateRoom(roomId);
  if (type === "INCREMENT") {
    room.board[square]++;
    io.to(roomId).emit("message", { type: "UPDATE", square, value: room.board[square] });
  }
}
