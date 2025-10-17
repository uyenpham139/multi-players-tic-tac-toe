import { Server, Socket } from "socket.io";
import {
  getOrCreateRoom,
  addPlayerToRoom,
  getActiveRooms,
  removePlayer,
} from "./roomManager";

interface ClientMessage {
  type: "INCREMENT" | "RESET" | "CONTINUE" | "REQUEST_RESET" | "REQUEST_CANCEL" | "WAITING" | "CAN_PLAY";
  square: number;
  roomId: string;
  from?: string;
  amount?: number;
}

interface JoinRoomResponse {
  success: boolean;
  message?: string;
}

const WINNING_LINES = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];

function checkWinner(board: number[]) {
  for (const line of WINNING_LINES) {
    const values = line.map(i => board[i]);
    if (values.every(v => v % 2 === 1 && v !== 0)) return { winner: "ODD" as const, line };
    if (values.every(v => v % 2 === 0 && v !== 0)) return { winner: "EVEN" as const, line };
  }
  return null;
}

function handlePlayerLeave(socket: Socket, io: Server, roomId?: string) {
  const leftRoomId = removePlayer(socket.id, io) || roomId;
  if (!leftRoomId) return;

  const room = getOrCreateRoom(leftRoomId, false, io);
  if (!room) return;

  // Reset board state
  room.board = Array(25).fill(0);
  room.isGameOver = false;
  room.winner = null;
  room.winningLine = null;

  // Notify others
  io.to(leftRoomId).emit("message", { type: "RESET", board: room.board });
  io.to(leftRoomId).emit("message", { type: "PLAYER_LEFT" });
}


export function registerGameEvents(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log(`🟢 User connected: ${socket.id}`);

    socket.on("get_rooms", () => {
      socket.emit("roomsUpdated", getActiveRooms());
    });

    socket.on(
      "joinRoom",
      (
        data: { roomId: string; role: "PLAYER" | "SPECTATOR" },
        callback: (res: JoinRoomResponse) => void
      ) => {
        const { roomId, role } = data;
        const isPlayer = role === "PLAYER";

        const room = getOrCreateRoom(roomId, isPlayer, io);
        if (!room) {
          callback({ success: false, message: "❌ Cannot join or create this room." });
          return;
        }

        const player = addPlayerToRoom(room, socket.id, role, io);
        if (!player) {
          callback({ success: false, message: "❌ Room is full or spectator limit reached." });
          return;
        }

        socket.join(roomId);

        socket.emit("message", {
          type: "PLAYER_ASSIGNED",
          player: player.role,
          board: room.board,
        });

        io.to(roomId).emit("message", {
          type: "STATUS",
          message: `${player.role} joined room ${roomId}`,
        });

        io.emit("roomsUpdated", getActiveRooms());
        callback({ success: true });

        const activePlayers = room.players.filter(p => p.role !== "SPECTATOR").length;

        if (activePlayers === 1) {
          io.to(roomId).emit("message", { type: "WAITING" });
        }

        if (activePlayers === 2) {
          io.to(roomId).emit("message", { type: "CAN_PLAY" });
        }
      }
    );

    socket.on("message", (data: ClientMessage) => {
      const { type, square, roomId, amount = 1, from } = data;
      const room = getOrCreateRoom(roomId, false, io);
      if (!room) return;

      switch (type) {
        case "INCREMENT": {
          if (room.players.filter(p => p.role !== "SPECTATOR").length < 2) {
            socket.emit("message", { type: "WAITING" });
            return;
          }

          if (room.isGameOver) return;

          const prevValue = room.board[square] ?? 0;
          room.board[square] = prevValue + amount;

          io.to(roomId).emit("message", { type: "UPDATE", square, amount });

          const result = checkWinner(room.board);
          if (result) {
            room.isGameOver = true;
            room.winner = result.winner;
            room.winningLine = result.line;

            io.to(roomId).emit("message", {
              type: "GAME_OVER",
              winner: result.winner,
              winningLine: result.line,
            });
          }
          break;
        }

        case "RESET": {
          room.board = Array(25).fill(0);
          room.isGameOver = false;
          room.winner = null;
          room.winningLine = null;
          io.to(roomId).emit("message", { type: "RESET" });
          break;
        }

        case "CONTINUE": {
          room.board = Array(25).fill(0);
          room.isGameOver = false;
          room.winner = null;
          room.winningLine = null;
          io.to(roomId).emit("message", { type: "CONTINUE" });
          break;
        }

        case "REQUEST_RESET": {
          if (room.players.find(p => p.id === socket.id)?.role === "SPECTATOR") {
            socket.emit("message", { type: "STATUS", message: "Spectators cannot reset the game." });
            return;
          }
          socket.to(roomId).emit("message", { type: "REQUEST_RESET", from });
          break;
        }

        case "REQUEST_CANCEL": {
          socket.to(roomId).emit("message", { type: "REQUEST_CANCEL" });
          break;
        }

        default:
          console.warn(`⚠️ Unknown message type from ${socket.id}: ${type}`);
      }
    });

    socket.on("leaveRoom", ({ roomId }) => {
      console.log(`🏠 ${socket.id} left room ${roomId}`);
      handlePlayerLeave(socket, io, roomId);
    });

    socket.on("disconnect", () => {
      removePlayer(socket.id, io);
      console.log(`🔴 User disconnected: ${socket.id}`);
      handlePlayerLeave(socket, io);
    });
  });
}
