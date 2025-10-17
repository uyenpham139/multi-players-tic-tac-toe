import { Server } from "socket.io";

interface Player {
  id: string;
  role: "ODD" | "EVEN" | "SPECTATOR";
}

interface Room {
  id: string;
  players: Player[];
  board: number[];
}

const rooms: Record<string, Room> = {};

function broadcastRooms(io: Server) {
  io.emit("roomsUpdated", getActiveRooms());
}

/*
  Get all active rooms
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
export function getOrCreateRoom(roomId: string, isPlayer: boolean, io: Server): Room | null {
  const activeRooms = Object.keys(rooms);

  if (!rooms[roomId] && activeRooms.length >= 5 && isPlayer) return null;
  if (!rooms[roomId] && !isPlayer) return null;

  if (!rooms[roomId]) {
    rooms[roomId] = { id: roomId, players: [], board: Array(25).fill(0) };
    broadcastRooms(io);
  }

  return rooms[roomId];
}

/*
  Add player or spectator
*/
export function addPlayerToRoom(room: Room, socketId: string, roleChoice: "PLAYER" | "SPECTATOR", io: Server): Player | null {
  if (roleChoice === "PLAYER") {
    const currentPlayers = room.players.filter(p => p.role !== "SPECTATOR");
    if (currentPlayers.length >= 2) return null;

    const role: "ODD" | "EVEN" = currentPlayers.length === 0 ? "ODD" : "EVEN";
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
export function removePlayer(socketId: string, io: Server) {
  for (const [roomId, room] of Object.entries(rooms)) {
    room.players = room.players.filter(p => p.id !== socketId);
    if (room.players.length === 0) {
      delete rooms[roomId];
    }
  }
  broadcastRooms(io);
}
