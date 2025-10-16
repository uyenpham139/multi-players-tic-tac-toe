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
    console.log(`User connected: ${socket.id}`);

    // Client asks for room list
    socket.on("get_rooms", () => {
      socket.emit("room_list", getActiveRooms());
    });

    // Join a room
    socket.on(
      "join_room",
      ({
        roomId,
        roleChoice,
      }: {
        roomId: string;
        roleChoice: "PLAYER" | "SPECTATOR";
      }) => {
        const isPlayer = roleChoice === "PLAYER";
        const room = getOrCreateRoom(roomId, isPlayer);

        if (!room) {
          socket.emit("message", {
            type: "ERROR",
            message: "Cannot join or create room.",
          });
          return;
        }

        const player = addPlayerToRoom(room, socket.id, roleChoice);
        if (!player) {
          socket.emit("message", {
            type: "ERROR",
            message: "Room full or spectator limit reached.",
          });
          return;
        }

        socket.join(roomId);

        // Send back role and board
        socket.emit("message", {
          type: "PLAYER_ASSIGNED",
          player: player.role,
          board: room.board,
        });

        // Notify everyone else
        io.to(roomId).emit("message", {
          type: "STATUS",
          message: `${player.role} joined room ${roomId}`,
        });

        io.emit("room_list", getActiveRooms());
      }
    );

    // Handle gameplay operations
    socket.on("message", (data: ClientMessage) => {
      const { type, square, roomId, amount = 1 } = data;
      const room = getOrCreateRoom(roomId, false);
      if (!room) return;

      switch (type) {
        case "INCREMENT": {
          // Apply operation on the server
          const prevValue = room.board[square] ?? 0;
          room.board[square] = prevValue + amount;

          console.log(
            `Square[${square}] incremented by ${amount}: ${prevValue} → ${room.board[square]}`
          );

          // Broadcast the *operation*, not the new value
          io.to(roomId).emit("message", {
            type: "UPDATE",
            square,
            amount, 
          });
          break;
        }

        default:
          console.warn(`Unknown message type from ${socket.id}:`, type);
          break;
      }
    });

    socket.on("disconnect", () => {
      removePlayer(socket.id);
      console.log(`User disconnected: ${socket.id}`);
      io.emit("room_list", getActiveRooms());
    });
  });
}
