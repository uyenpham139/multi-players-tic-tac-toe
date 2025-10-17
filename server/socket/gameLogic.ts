import { Server, Socket } from "socket.io";
import {
  getOrCreateRoom,
  addPlayerToRoom,
  getActiveRooms,
  removePlayer,
} from "./roomManager";

interface ClientMessage {
  type: "INCREMENT";
  square: number;
  roomId: string;
  amount?: number;
}

export function registerGameEvents(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log(`🟢 User connected: ${socket.id}`);

    /*
      Client asks for room list
    */
    socket.on("get_rooms", () => {
      socket.emit("roomsUpdated", getActiveRooms());
    });

    /*
      Player or spectator joins a room
    */
    socket.on(
      "joinRoom",
      ({
        roomId,
        role,
      }: {
        roomId: string;
        role: "PLAYER" | "SPECTATOR";
      }) => {
        const isPlayer = role === "PLAYER";

        const room = getOrCreateRoom(roomId, isPlayer, io);
        if (!room) {
          socket.emit("message", {
            type: "ERROR",
            message: "❌ Cannot join or create this room.",
          });
          return;
        }

        if (room.players.some(p => p.id === socket.id)) return;

        const player = addPlayerToRoom(room, socket.id, role, io);
        if (!player) {
          socket.emit("message", {
            type: "ERROR",
            message: "❌ Room is full or spectator limit reached.",
          });
          return;
        }

        socket.join(roomId);

        // Send back role & initial board
        socket.emit("message", {
          type: "PLAYER_ASSIGNED",
          player: player.role,
          board: room.board,
        });

        // Notify all members of the room
        io.to(roomId).emit("message", {
          type: "STATUS",
          message: `${player.role} joined room ${roomId}`,
        });

        // Broadcast updated room list to all clients
        io.emit("roomsUpdated", getActiveRooms());

        console.log(
          `👤 ${player.role} (${socket.id}) joined ${roomId}. Players: ${room.players.length}`
        );
      }
    );

    /*
      Handle gameplay events (INCREMENT, etc.)
    */
    socket.on("message", (data: ClientMessage) => {
      const { type, square, roomId, amount = 1 } = data;
      const room = getOrCreateRoom(roomId, false, io);
      if (!room) return;

      switch (type) {
        case "INCREMENT": {
          const prevValue = room.board[square] ?? 0;
          room.board[square] = prevValue + amount;

          console.log(
            `⚙️ Room ${roomId}: Square[${square}] += ${amount} → ${room.board[square]}`
          );

          // Broadcast delta (amount) to all players in the same room
          io.to(roomId).emit("message", {
            type: "UPDATE",
            square,
            amount,
          });
          break;
        }

        default:
          console.warn(`⚠️ Unknown message type from ${socket.id}: ${type}`);
          break;
      }
    });

    /*
      When a user disconnects
    */
    socket.on("disconnect", () => {
      removePlayer(socket.id, io);
      console.log(`🔴 User disconnected: ${socket.id}`);

      // Update room list for everyone
      io.emit("roomsUpdated", getActiveRooms());
    });
  });
}
