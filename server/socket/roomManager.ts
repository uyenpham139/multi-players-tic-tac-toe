import { Server } from "socket.io";

export interface Player {
  id: string;
  role: "ODD" | "EVEN" | "SPECTATOR";
}

interface Room {
  id: string;
  players: Player[];
  board: number[];
  isGameOver: boolean;
  winner: "ODD" | "EVEN" | null;
  winningLine: number[] | null;
  resetVotes: Set<string>;
}

const rooms: Record<string, Room> = {};

function broadcastRooms(io: Server) {
  io.emit("roomsUpdated", getActiveRooms());
}

/*
  Get all active rooms (for lobby UI)
*/
export function getActiveRooms() {
  return Object.values(rooms).map(room => ({
    id: room.id,
    playerCount: room.players.filter(p => p.role !== "SPECTATOR").length,
    spectatorCount: room.players.filter(p => p.role === "SPECTATOR").length,
  }));
}

/*
  Get or create a new room (Only players can create)
*/
export function getOrCreateRoom(
  roomId: string,
  isPlayer: boolean,
  io: Server
): Room | null {
  const activeRooms = Object.keys(rooms);

  if (!rooms[roomId] && activeRooms.length >= 5 && isPlayer) return null;
  if (!rooms[roomId] && !isPlayer) return null;

  if (!rooms[roomId]) {
    rooms[roomId] = {
      id: roomId,
      players: [],
      board: Array(25).fill(0),
      isGameOver: false,
      winner: null,
      winningLine: null,
      resetVotes: new Set(),
    };
    broadcastRooms(io);
  }

  return rooms[roomId];
}

/*
  Add player or spectator to room
*/
export function addPlayerToRoom(
  room: Room,
  socketId: string,
  roleChoice: "PLAYER" | "SPECTATOR",
  io: Server
): Player | null {
  if (roleChoice === "PLAYER") {
    const currentPlayers = room.players.filter(p => p.role !== "SPECTATOR");
    if (currentPlayers.length >= 2) return null;

    const hasOdd = currentPlayers.some(p => p.role === "ODD");
    const role: "ODD" | "EVEN" = hasOdd ? "EVEN" : "ODD";

    const player: Player = { id: socketId, role };
    room.players.push(player);
    broadcastRooms(io);
    return player;
  }

  const spectator: Player = { id: socketId, role: "SPECTATOR" };
  room.players.push(spectator);
  broadcastRooms(io);
  return spectator;
}

/*
  Remove player and delete room if empty
*/
export function removePlayer(socketId: string, io: Server): string | null {
  for (const [roomId, room] of Object.entries(rooms)) {
    const playerIndex = room.players.findIndex(p => p.id === socketId);
    if (playerIndex !== -1) {
      room.players.splice(playerIndex, 1);

      // Delete empty room
      if (room.players.length === 0) {
        delete rooms[roomId];
      }

      broadcastRooms(io);
      return roomId;
    }
  }

  return null;
}

